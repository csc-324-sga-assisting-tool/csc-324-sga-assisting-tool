import {assert, beforeAll, it, describe} from 'vitest';
import {Budget, Item, Sort, DataModel, User} from 'lib/data';
import {getLocalFirebase} from '../../utils/database.util';
import {Collections} from 'lib/firebase';
import {
  defaultTestBudget,
  defaultTestItem,
  defaultTestUser,
} from '../../utils/defaults';

const database = getLocalFirebase();
const dataModel = new DataModel(database);

beforeAll(async () => {
  const testItems: Item[] = [1, 2, 3].map(number => {
    return {
      ...defaultTestItem,
      budget_id: 'test_budget_for_items',
      id: `item_${number}`,
    };
  });
  const testBudget: Budget = {
    ...defaultTestBudget,
    id: 'test_budget_for_items',
    user_id: 'user_items', // the user this budget belongs to
  };

  const addItemTestBudget: Budget = {
    ...defaultTestBudget,
    id: 'test_budget_for_add_items',
    user_id: 'user_items', // the user this budget belongs to
  };

  const testUser: User = {
    ...defaultTestUser,
    id: 'user_items',
    remaining_budget: 500,
    total_budget: 500,
  };

  await dataModel.setUser(testUser);
  await dataModel.addBudget(testBudget);
  await dataModel.addBudget(addItemTestBudget);
  await database.addManyDocuments(Collections.Items, testItems);
});

describe('Test getBudgetItems', async () => {
  it('function gets all correct budgets user_1', async () => {
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
  it('function return empty array on nonexistent budget', async () => {
    const items: Item[] = await dataModel.getItemsForBudget(
      'budget_5',
      new Sort('id')
    );
    assert.equal(items.length, 0);
  });
});

describe('Test addItem and addItems', async () => {
  it('addItem correctly adds one item to a budget', async () => {
    const item: Item = {
      ...defaultTestItem,
      budget_id: 'test_budget_for_add_items',
      id: 'test_additem',
    };
    await dataModel.addItem(item);
    const test_budget_upd = await dataModel.getBudget(
      'test_budget_for_add_items'
    );

    assert.equal(test_budget_upd.total_cost, item.unit_price * item.quantity);
    const items = await dataModel.getItemsForBudget(
      'test_budget_for_add_items'
    );

    assert.deepEqual(items.pop(), item);
  });

  it('addItems correctly adds items to a budget', async () => {
    const items: Item[] = [1, 2, 3].map(number => {
      return {
        ...defaultTestItem,
        id: `item_add_item${number}`,
        budget_id: 'test_budget_for_add_items',
        unit_price: 10.0,
        quantity: 2,
      };
    });
    await dataModel.addItems(items);
    const test_budget_upd = await dataModel.getBudget(
      'test_budget_for_add_items'
    );
    // We add one to items.length because of the item we added in the test above
    assert.equal(test_budget_upd.total_cost, (items.length + 1) * 10 * 2);

    assert.deepEqual(items, items);
  });
});
