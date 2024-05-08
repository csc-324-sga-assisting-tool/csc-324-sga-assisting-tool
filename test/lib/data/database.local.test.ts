import {Document} from 'lib/data';
import {beforeEach, beforeAll, describe, expect, test} from 'vitest';
import {clearCollection} from '../../utils/database.util';
import {Filter, Sort} from 'lib/data/database';
import {LocalDatabase} from '../../utils/database.local';
import {Collections} from 'lib/firebase';
import {
  createItem,
  createBudget,
  createBudgetSync,
  createUser,
  createComment,
} from 'lib/data/utils';

const testCollection = Collections.Items;
const database = new LocalDatabase();

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

// On cold starts Firebase emulator is slow causing our tests to timeout
// I am adding a few documents then clearing for perfomance
beforeAll(async () => {
  await database.addManyDocuments(testCollection, generateTestDocuments(10));
  await clearCollection(database, testCollection);
});

beforeEach(async () => {
  await clearCollection(database, testCollection);
});

describe('Test LocalDatabase class', async () => {
  test('adding with addDocument and getDocument work', async () => {
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

  test('adding many documents with addManyDocuments works', async () => {
    const testDocuments = generateTestDocuments(3);
    // Add test documents to collection with batch adder addManyDocuments
    await database.addManyDocuments(testCollection, testDocuments);

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
  }, 10000);

  // Test deleteDocument
  test('check that documents are deleted correctly', async () => {
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
  }, 10000);

  test('test that sorting and filtering work simultaneuosly', async () => {
    const testDocuments: TestDocument[] = generateTestDocuments(3);
    testDocuments.forEach(
      async document => await database.addDocument(testCollection, document)
    );
    // No Filters, Sort by field descending
    const docs = await database.getDocuments(
      testCollection,
      [new Filter('number', '<', 3)],
      new Sort('field', true)
    );

    expect(docs[0].id).toEqual(testDocuments[1].id);
    expect(docs[0].number).toEqual(testDocuments[1].number);
    expect(docs[0].field).toEqual(testDocuments[1].field);

    expect(docs[1].id).toEqual(testDocuments[0].id);
    expect(docs[1].number).toEqual(testDocuments[0].number);
    expect(docs[1].field).toEqual(testDocuments[0].field);
  }, 10000);

  test('test that filtering works', async () => {
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
  }, 10000);

  test('test that multifiltering works', async () => {
    const testDocuments: TestDocument[] = generateTestDocuments(3);
    testDocuments.forEach(
      async document => await database.addDocument(testCollection, document)
    );
    // No Filters, Sort by field descending
    // Filter number > 1, Sort by field
    const docs = await database.getDocuments<TestDocument>(testCollection, [
      new Filter('number', '>', 1),
      new Filter('number', '<', 3),
    ]);
    expect(docs.length).toEqual(1);
  }, 10000);

  test('test that equality filtering works', async () => {
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
  }, 10000);
});
