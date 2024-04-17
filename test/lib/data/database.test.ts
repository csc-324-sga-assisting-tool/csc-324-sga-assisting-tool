import {Document} from 'lib/data';
import {describe, expect, test} from 'vitest';
import {getFirestore} from 'firebase/firestore';
import {clearCollection, getLocalFirebase} from '../../utils/database.util';
import {Filter, Sort} from 'lib/data/database';

// Set up a Firestore Database for testing
const testCollection = 'test_collection';
const db = getFirestore();

interface TestDocument extends Document {
  field: string;
  number: number;
}

function generateTestDocuments(howMany: number) {
  const documents: TestDocument[] = [];
  for (let i = 1; i <= howMany; i++) {
    documents.push({
      id: `testDocument${i}`,
      field: `${howMany - i}test_document`, // inverse so we can check sorting works
      number: i,
    });
  }
  return documents;
}

describe('Test FirestoreDatabase class', async () => {
  const database = getLocalFirebase(db);

  test('adding with addDocument and getDocument work', async () => {
    // Add test documents to collection
    await clearCollection(database, testCollection);

    const testDocuments = generateTestDocuments(3);
    for (const document of testDocuments) {
      await database.addDocument(testCollection, document);
    }

    // Test getDocument
    const doc1 = await database.getDocument<TestDocument>(
      testCollection,
      'testDocument1'
    );
    const doc2 = await database.getDocument<TestDocument>(
      testCollection,
      'testDocument2'
    );
    const doc3 = await database.getDocument<TestDocument>(
      testCollection,
      'testDocument3'
    );

    expect(doc1).toEqual(testDocuments[0]);
    expect(doc2).toEqual(testDocuments[1]);
    expect(doc3).toEqual(testDocuments[2]);
  });

  // Test deleteDocument
  test('check that documents are deleted correctly', async () => {
    // Add dummy documents
    await clearCollection(database, testCollection);
    const testDocuments = generateTestDocuments(3);
    for (const document of testDocuments) {
      await database.addDocument(testCollection, document);
    }

    // Delete them the first two
    await database.deleteDocument(testCollection, testDocuments[0]);
    await database.deleteDocument(testCollection, testDocuments[1]);

    await expect(() =>
      database.getDocument<Document>(testCollection, testDocuments[0].id)
    ).rejects.toThrowError();

    await expect(() =>
      database.getDocument<Document>(testCollection, testDocuments[1].id)
    ).rejects.toThrowError();

    const doc = await database.getDocument<TestDocument>(
      testCollection,
      testDocuments[2].id
    );
    expect(doc).toEqual(testDocuments[2]);
  });

  test('test that sorting works', async () => {
    // clear db so we start fresh
    await clearCollection(database, testCollection);
    const testDocuments: TestDocument[] = generateTestDocuments(3);
    testDocuments.forEach(
      async document => await database.addDocument(testCollection, document)
    );
    // No Filters, Sort by field descending
    const docs = await database.getDocuments(
      testCollection,
      [],
      new Sort('field', true)
    );

    expect(docs[0].id).toEqual(testDocuments[2].id);
    expect(docs[0].number).toEqual(testDocuments[2].number);
    expect(docs[0].field).toEqual(testDocuments[2].field);

    expect(docs[1].id).toEqual(testDocuments[1].id);
    expect(docs[1].number).toEqual(testDocuments[1].number);
    expect(docs[1].field).toEqual(testDocuments[1].field);

    expect(docs[2].id).toEqual(testDocuments[0].id);
    expect(docs[2].number).toEqual(testDocuments[0].number);
    expect(docs[2].field).toEqual(testDocuments[0].field);
  });

  test('test that filtering works', async () => {
    // clear db so we start fresh
    await clearCollection(database, testCollection);

    const testDocuments: TestDocument[] = generateTestDocuments(3);
    testDocuments.forEach(
      async document => await database.addDocument(testCollection, document)
    );
    // No Filters, Sort by field descending
    // Filter number > 1, Sort by field
    const docs = await database.getDocuments<TestDocument>(testCollection, [
      new Filter('number', '>', 1),
    ]);
    expect(docs.length).toEqual(2);
  });

  test('test that equality filtering works', async () => {
    // clear db so we start fresh
    await clearCollection(database, testCollection);

    const testDocuments: TestDocument[] = generateTestDocuments(3);
    testDocuments.forEach(
      async document => await database.addDocument(testCollection, document)
    );
    // No Filters, Sort by field descending
    // Filter number > 1, Sort by field
    const docs = await database.getDocuments<TestDocument>(testCollection, [
      new Filter('id', '==', testDocuments[0].id),
    ]);
    expect(docs.length).toEqual(1);
    expect(docs[0].id).toEqual(testDocuments[0].id);
    expect(docs[0].field).toEqual(testDocuments[0].field);
  });
});
