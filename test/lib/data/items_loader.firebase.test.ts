import {assert, beforeAll, it, describe} from 'vitest';
import {
  connectFirestoreEmulator,
  getFirestore,
  doc,
  writeBatch,
} from 'firebase/firestore';
import {Budget, Item, getBudgetItems} from 'lib/data';
import {
  Collections,
  getBudgetFirebase,
  getUserBudgetsFirebase,
} from 'lib/firebase';

const db = getFirestore();

beforeAll(async () => {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  const testItems: Item[] = [1, 2, 3].map(number => {
    return {
      budget_id: `budget_${number}`,
      cost: 10.0,
      id: 'item_1',
      name: 'testing item 1',
      quantity: 2,
      rso_item_comment: null,
      sga_item_comment: null,
      url: 'test',
      vendor: 'test',
    };
  });

  const batch = writeBatch(db);

  testItems.map(async (item: Item) => {
    batch.set(doc(db, Collections.Items, item.id), item);
  });

  await batch.commit();
});
