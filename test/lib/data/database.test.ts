import {FirestoreDatabase} from '../../../src/lib/data/database.firebase';
import {Sort, Filter} from '../../../src/lib/data/database';
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
    expect(doc1.field).toBe(testDocument1.field);
    expect(doc2.field).toBe(testDocument2.field);
    expect(doc3.field).toBe(testDocument3.field);
  });

  // Test deleteDocument
  database.deleteDocument(collection_name, doc1);
  database.deleteDocument(collection_name, doc2);
  test('Database.deleteDocument', () => {
    expect(() =>
      database.getDocument<TestDocument>(collection_name, testDocument1.id)
    ).toThrowError();
    expect(() =>
      database.getDocument<TestDocument>(collection_name, testDocument2.id)
    ).toThrowError();
    const doc = database.getDocument<TestDocument>(
      collection_name,
      testDocument3.id
    );
    expect(doc).toBe(testDocument3);
  });

  // Test addDocument
  const {['id']: _, ...doc1Data} = testDocument1; // This removes the id field
  const {['id']: __, ...doc2Data} = testDocument2;
  const {['id']: ___, ...doc3Data} = testDocument3;
  testDocument1.id = await database.addDocument(collection_name, doc1Data);
  testDocument2.id = await database.addDocument(collection_name, doc2Data);
  testDocument3.id = await database.addDocument(collection_name, doc3Data);

  // Test getDocuments
  test('Database.addDocument/Database.getDocuments', async () => {
    // No Filters, Sort by id
    let docs = await database.getDocuments<TestDocument>(
      collection_name,
      [],
      new Sort('id')
    );
    expect(docs).toEqual([testDocument1, testDocument2, testDocument3]);

    // No Filters, Sort by id descending
    docs = await database.getDocuments<TestDocument>(
      collection_name,
      [],
      new Sort('id', false)
    );
    expect(docs).toEqual([testDocument3, testDocument2, testDocument1]);

    // No Filters, Sort by field
    docs = await database.getDocuments<TestDocument>(
      collection_name,
      [],
      new Sort('field')
    );
    expect(docs).toEqual([testDocument2, testDocument3, testDocument1]);

    // Filter number > 1, Sort by id
    docs = await database.getDocuments<TestDocument>(
      collection_name,
      [new Filter('number', '>', 1)],
      new Sort('id')
    );
    expect(docs).toEqual([testDocument2, testDocument3]);

    // Filter number > 1 and field == aardvark, Sort by id
    docs = await database.getDocuments<TestDocument>(
      collection_name,
      [new Filter('number', '>', 1), new Filter('field', '==', 'aardvark')],
      new Sort('id')
    );
    expect(docs).toEqual([testDocument2]);

    // Filter number > 2 and field == aardvark, Sort by id
    docs = await database.getDocuments<TestDocument>(
      collection_name,
      [new Filter('number', '>', 2), new Filter('field', '==', 'aardvark')],
      new Sort('id')
    );
    expect(docs).toEqual([]);
  });
});
