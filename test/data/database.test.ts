import {Database, Collection, Document} from '../../src/lib/data/database';
import {
  FirestoreDatabase,
  FirestoreCollection,
} from '../../src/lib/data/database.firebase';
import {expect, test} from 'vitest';

// Test database, collection, and document names
const database_name = 'test_database';
const collection_name = 'test_collection';
const database = new Database(database_name);

test('Test Database class', () => {
  // Test that the database was correctly constructed
  expect(database.name).toBe(database_name);

  // Test getCollection
  const collection = database.getCollection(collection_name);
  expect(collection.name).toBe(collection_name);
});

test('Test Collection class', async () => {
  // Get a collection
  const collection = database.getCollection(collection_name);

  // Test addDocument( ID )
  type TestDocument = {
    id: string;
    field: string;
  };
  const testDocument1 = {
    id: 'testDocument1',
    field: 'testField1',
  };
  const testDocument2 = {
    id: 'testDocument2',
    field: 'testField2',
  };
  collection.addDocument(testDocument1);
  collection.addDocument(testDocument2);

  // Test getDocument
  const doc1 = await collection.getDocument<TestDocument>(testDocument1.id);
  const doc2 = await collection.getDocument<TestDocument>(testDocument2.id);
  expect(doc1.field).toBe(testDocument1.field);
  expect(doc2.field).toBe(testDocument2.field);

  // Test deleteDocument
  collection.deleteDocument(doc1);
  collection.deleteDocument(doc2);

  // Ensure that trying to get those documents fails
  expect(() => {
    collection.getDocument<TestDocument>(testDocument1.id);
  }).toThrowError();
});
