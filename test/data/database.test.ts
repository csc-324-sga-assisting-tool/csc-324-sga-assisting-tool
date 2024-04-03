import {Database} from '../../src/data/database';
import {expect, test} from 'vitest';

test('Test Database class', () => {
  // Test the constructor
  const database_name = 'test_database';
  const database = new Database(database_name);
  expect(database.name).toBe(database_name);

  // Test getCollection
  const collection_name = 'test_collection';
  const collection = database.getCollection(collection_name);
  expect(collection.name).toBe(collection_name);
});
