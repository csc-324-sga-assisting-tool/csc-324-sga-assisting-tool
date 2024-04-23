import {assert, beforeAll, it, describe, expect} from 'vitest';
import {Budget, Item, Sort, DataModel} from 'lib/data';
import {getFirestore} from 'firebase/firestore';
import {getLocalFirebase} from '../../utils/database.util';
import {Collections} from 'lib/firebase';

const db = getFirestore();
const database = getLocalFirebase(db);
beforeAll(async () => {
  const testItems: Item[] = [1, 2, 3].map(number => {
    return {
      budget_id: 'test_budget_for_items',
      unit_cost: 10.0,
      id: `item_${number}`,
      name: `testing item ${number}`,
      quantity: 2,
      rso_item_comment: null,
      sga_item_comment: null,
      url: 'test',
      vendor: 'test',
    };
  });

  const test_budget: Budget = {
    id: 'test_budget_for_items',
    user_id: 'user_1', // the user this budget belongs to
    event_name: 'test_for_items',
    event_description: 'test_for_items',
    total_cost: 10.0 * 3 * 2,
    current_status: 'created',
    status_history: [],
    items: [],
  };
  database.addManyDocuments(Collections.Items, testItems);
  const dataModel = new DataModel(database);
  dataModel.addBudget(test_budget);
});

describe('Test getBudgetItems', async () => {
  const dataModel = new DataModel(database);

  it('function gets all correct budgets user 1', async () => {
    const items: Item[] = await dataModel.getItemsForBudget(
      'test_budget_for_items',
      new Sort('id')
    );
    assert.equal(
      items.length,
      3,
      `test_budget_for_items has 3 items but call returned ${items.length}`
    );
    let i = 1;
    items.forEach(item => {
      assert.equal(item!.id, `item_${i++}`);
    });
  });
  it('function errors on nonexistent budget', async () => {
    await expect(
      async () => await dataModel.getItemsForBudget('budget_5', new Sort('id'))
    ).resolves.toHaveValue([]);
  });
});
