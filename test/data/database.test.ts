import {Database, Collection} from '../../src/data/database';
import {expect, test} from 'vitest';

// Test database, collection, and document names
const database_name = 'test_database';
const collection_name = 'test_collection';

test('Test Database class', () => {
  // Test the constructor
  const database = new Database(database_name);
  expect(database.name).toBe(database_name);

  // Test getCollection
  const collection = database.getCollection(collection_name);
  expect(collection.name).toBe(collection_name);
});

test('Test Collection class', () => {
  // Test the constructor
  const collection = new Collection(collection_name, database_name);
  expect(collection.name).toBe(collection_name);

  // Test addDocument( ID )
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
  // TODO? I don't know if there's a way to test if this works other than
  // by simply testing if getDocument now works

  // Test getDocument
  // TODO: Obviously since getDocument returns a Document, it won't
  // have a 'field' field, even though it should.  Fix.
  const doc1 = collection.getDocument(testDocument1.id);
  const doc2 = collection.getDocument(testDocument2.id);
  expect(doc1.field).toBe(testDocument1.field);
  expect(doc2.field).toBe(testDocument2.field);
});
