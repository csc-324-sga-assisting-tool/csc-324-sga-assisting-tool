import {assert, beforeAll, it, describe} from 'vitest';
import {connectFirestoreEmulator, getFirestore} from 'firebase/firestore';
import {DataModifier, Item, DataProvider, Sort} from 'lib/data';
import {Collections, getBudgetItems, FirestoreDatabase} from 'lib/firebase';

const db = getFirestore();
const database = new FirestoreDatabase(db);
beforeAll(async () => {
  const host =
    (db.toJSON() as {settings?: {host?: string}}).settings?.host ?? '';
  if (process.env.APP_ENV === 'local' && !host.startsWith('localhost')) {
    connectFirestoreEmulator(db, 'localhost', 8080);
  }
  const dataModifier = new DataModifier(database);
  const testItems: Item[] = [1, 2, 3].map(number => {
    return {
      budget_id: 'test_budget_for_items',
      cost: 10.0,
      id: `item_${number}`,
      name: `testing item ${number}`,
      quantity: 2,
      rso_item_comment: null,
      sga_item_comment: null,
      url: 'test',
      vendor: 'test',
    };
  });
  testItems.forEach(item => {
    dataModifier.addItem(item);
  });
});

describe('Test getBudgetItems', async () => {
  const dataProvider = new DataProvider(database);
  const items = await dataProvider.getBudgetItems(
    'test_budget_for_items',
    new Sort('id')
  );
});
