import {FirestoreDatabase} from '../../../src/lib/data/database.firebase';
import {Sort, Filter, Document} from '../../../src/lib/data/database';
import {beforeAll, describe, expect, test} from 'vitest';
import {connectFirestoreEmulator, getFirestore} from 'firebase/firestore';

// Set up a Firestore Database for testing
const db = getFirestore();
beforeAll(async () => {
  const host =
    (db.toJSON() as {settings?: {host?: string}}).settings?.host ?? '';
  if (process.env.APP_ENV === 'local' && !host.startsWith('localhost')) {
    connectFirestoreEmulator(db, 'localhost', 8080);
  }
});

const collection_name = 'test_collection';

describe('Test FirestoreDatabase class', async () => {
  // Create a database
  const database = new FirestoreDatabase(db);

  // Empty the database
  const leftOverDocs = await database.getDocuments(
    collection_name,
    [],
    new Sort('id')
  );
  leftOverDocs.forEach(async (doc: Document) => {
    await database.deleteDocument(collection_name, doc);
  });

  // Initialize the database with some test documents
  type TestDocument = {
    id: string;
    field: string;
    number: number;
  };
  const testDocument1 = {
    id: 'testDocument1',
    field: 'xenophobia',
    number: 1,
  };
  const testDocument2 = {
    id: 'testDocument2',
    field: 'aardvark',
    number: 2,
  };
  const testDocument3 = {
    id: 'testDocument3',
    field: 'baby',
    number: 3,
  };

  await database.addDocumentWithId(collection_name, testDocument1);
  await database.addDocumentWithId(collection_name, testDocument2);
  await database.addDocumentWithId(collection_name, testDocument3);

  // Test getDocument
  const doc1 = await database.getDocument<TestDocument>(
    collection_name,
    testDocument1.id
  );
  const doc2 = await database.getDocument<TestDocument>(
    collection_name,
    testDocument2.id
  );
  const doc3 = await database.getDocument<TestDocument>(
    collection_name,
    testDocument3.id
  );
  test('Database.addDocumentWithId/Database.getDocument', () => {
    expect(doc1).toEqual(testDocument1);
    expect(doc2).toEqual(testDocument2);
    expect(doc3).toEqual(testDocument3);
  });

  // Test deleteDocument
  await database.deleteDocument(collection_name, testDocument1);
  await database.deleteDocument(collection_name, testDocument2);
  test('Database.deleteDocument', async () => {
    await expect(() =>
      database.getDocument<TestDocument>(collection_name, testDocument1.id)
    ).rejects.toThrowError();
    await expect(() =>
      database.getDocument<TestDocument>(collection_name, testDocument2.id)
    ).rejects.toThrowError();
    const doc = await database.getDocument<TestDocument>(
      collection_name,
      testDocument3.id
    );
    expect(doc).toEqual(testDocument3);
  });

  // Test addDocument
  const {['id']: _, ...doc1Data} = testDocument1; // This removes the id field
  const {['id']: __, ...doc2Data} = testDocument2;
  const {['id']: ___, ...doc3Data} = testDocument3;
  const id1 = await database.addDocument(collection_name, doc1Data);
  const id2 = await database.addDocument(collection_name, doc2Data);
  const id3 = await database.addDocument(collection_name, doc3Data);
  const testDocument4 = {
    id: id1,
    ...doc1Data,
  };
  const testDocument5 = {
    id: id2,
    ...doc2Data,
  };
  const testDocument6 = {
    id: id3,
    ...doc3Data,
  };

  // Test getDocuments
  test('Database.addDocument/Database.getDocuments', async () => {
    // No Filters, Sort by id
    let docs = await database.getDocuments<TestDocument>(
      collection_name,
      [],
      new Sort('id')
    );
    expect(docs).toEqual([testDocument4, testDocument5, testDocument6]);

    // No Filters, Sort by id descending
    docs = await database.getDocuments<TestDocument>(
      collection_name,
      [],
      new Sort('id', false)
    );
    expect(docs).toEqual([testDocument6, testDocument5, testDocument4]);

    // No Filters, Sort by field
    docs = await database.getDocuments<TestDocument>(
      collection_name,
      [],
      new Sort('field')
    );
    expect(docs).toEqual([testDocument5, testDocument6, testDocument4]);

    // Filter number > 1, Sort by id
    docs = await database.getDocuments<TestDocument>(
      collection_name,
      [new Filter('number', '>', 1)],
      new Sort('id')
    );
    expect(docs).toEqual([testDocument5, testDocument6]);

    // Filter number > 1 and field == aardvark, Sort by id
    docs = await database.getDocuments<TestDocument>(
      collection_name,
      [new Filter('number', '>', 1), new Filter('field', '==', 'aardvark')],
      new Sort('id')
    );
    expect(docs).toEqual([testDocument5]);

    // Filter number > 2 and field == aardvark, Sort by id
    docs = await database.getDocuments<TestDocument>(
      collection_name,
      [new Filter('number', '>', 2), new Filter('field', '==', 'aardvark')],
      new Sort('id')
    );
    expect(docs).toEqual([]);
  });
});