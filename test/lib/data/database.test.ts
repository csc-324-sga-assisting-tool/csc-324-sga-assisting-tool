import {FirestoreDatabase} from '../../../src/lib/data/database.firebase';
import {
  Sort,
  Filter,
  Document,
  IDatabase,
} from '../../../src/lib/data/database';
import {beforeAll, describe, expect, test} from 'vitest';
import {initializeApp} from 'firebase/app';
import {connectFirestoreEmulator, getFirestore} from 'firebase/firestore';

// Set up a Firestore Database for testing
const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: '',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
beforeAll(async () => {
  //const host =
  //(db.toJSON() as {settings?: {host?: string}}).settings?.host ?? '';
  //if (process.env.APP_ENV === 'local' && !host.startsWith('localhost')) {
  //if(process.env.APP_ENV === 'local') {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  //}
});

async function clearDatabase(database: IDatabase) {
  const leftOverDocs = await database.getDocuments(
    collection_name,
    [],
    new Sort('id'),
    1000
  );
  leftOverDocs.forEach(async (doc: Document) => {
    await database.deleteDocument(collection_name, doc);
  });
}

const collection_name = 'test_collection';

describe('Test FirestoreDatabase class', async () => {
  // Create a database
  const database = new FirestoreDatabase(db);
  clearDatabase(database);

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

  // Test getDocuments
  test('Database.addDocumentWithId/Database.getDocuments', async () => {
    // Add Documents
    await database.addDocumentWithId(collection_name, testDocument1);
    await database.addDocumentWithId(collection_name, testDocument2);
    await database.addDocumentWithId(collection_name, testDocument3);

    // No Filters, Sort by id
    let docs = await database.getDocuments<TestDocument>(
      collection_name,
      [],
      new Sort('field')
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

    // Clear the database
    clearDatabase(database);
  });

  // Test deleteDocument
  test('Database.deleteDocument', async () => {
    // Add Documents to the database
    await database.addDocumentWithId(collection_name, testDocument1);
    await database.addDocumentWithId(collection_name, testDocument2);
    await database.addDocumentWithId(collection_name, testDocument3);

    // Delete the documents
    await database.deleteDocument(collection_name, testDocument1);
    await database.deleteDocument(collection_name, testDocument2);

    // Check that they're deleted or not deleted
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

    // Clear the database
    clearDatabase(database);
  });

  // Test addDocument
  test('Database.addDocument/Database.getDocument', async () => {
    // Separate the id from the rest of the data
    const {['id']: _, ...doc1Data} = testDocument1;
    const {['id']: __, ...doc2Data} = testDocument2;
    const {['id']: ___, ...doc3Data} = testDocument3;

    // Add the documents but let the database pick an id
    const id1 = await database.addDocument(collection_name, doc1Data);
    const id2 = await database.addDocument(collection_name, doc2Data);
    const id3 = await database.addDocument(collection_name, doc3Data);

    // Add the id back to the data
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

    // Test getDocument
    const doc1 = await database.getDocument<TestDocument>(
      collection_name,
      testDocument4.id
    );
    const doc2 = await database.getDocument<TestDocument>(
      collection_name,
      testDocument5.id
    );
    const doc3 = await database.getDocument<TestDocument>(
      collection_name,
      testDocument6.id
    );
    expect(doc1).toEqual(testDocument4);
    expect(doc2).toEqual(testDocument5);
    expect(doc3).toEqual(testDocument6);

    // Clear the database
    clearDatabase(database);
  });
});
