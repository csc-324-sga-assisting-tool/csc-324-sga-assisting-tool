import {assert, beforeAll, it, describe} from 'vitest';
import {Item, Sort, DataModel} from 'lib/data';
import {getFirestore} from 'firebase/firestore';
import {Collections, getBudgetItems, FirestoreDatabase} from 'lib/firebase';
import {getLocalFirebase} from '../../utils/database.util';

const db = getFirestore();
const database = getLocalFirebase(db);
const dataModel = new DataModel(database);
beforeAll(async () => {
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
    dataModel.addItem(item);
  });
});

describe('Test getBudgetItems', async () => {
  it('function gets all correct budgets user 1', async () => {
    const items = await dataModel.getBudgetItems(
      'test_budget_for_items',
      new Sort('id')
    );
    assert.equal(
      items.length,
      3,
      `test_budget_for_items has 3 items but call returned ${items.length}`
    );
  });
});
