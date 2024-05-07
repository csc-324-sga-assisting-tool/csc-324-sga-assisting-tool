import {assert, beforeEach, test, describe} from 'vitest';
import {Budget, Item, Sort, DataModel, User} from 'lib/data';
import {clearCollection} from '../../utils/database.util';
import {
  createItem,
  createBudget,
  createBudgetSync,
  createUser,
} from 'lib/data/utils';
import {Collections} from 'lib/firebase';
import {
  defaultTestBudget,
  defaultTestItem,
  defaultTestUser,
} from '../../utils/defaults';
import {LocalDatabase} from '../../utils/database.local';

const database = new LocalDatabase();
const dataModel = new DataModel(database);

beforeEach(async () => {
  await clearCollection(database, Collections.Users);
  await clearCollection(database, Collections.Budgets);
  await clearCollection(database, Collections.Items);

  const testBudget: Budget = {
    ...defaultTestBudget,
    id: 'test_budget_for_items',
    user_id: 'items_loader_test_user',
  };

  const addItemTestBudget: Budget = {
    ...defaultTestBudget,
    id: 'test_budget_for_add_items',
    user_id: 'items_loader_test_user',
  };

  const testUser: User = {
    ...defaultTestUser,
    id: 'items_loader_test_user',
    remaining_budget: 500,
    total_budget: 500,
  };

  await database.addDocument(Collections.Users, testUser);
  await database.addManyDocuments(Collections.Budgets, [
    testBudget,
    addItemTestBudget,
  ]);
});

describe('Test getBudgetItems', async () => {
  test('getItemsForBudget works', async () => {
    // Add items
    const testItems: Item[] = [1, 2, 3].map(number => {
      return {
        ...defaultTestItem,
        budget_id: 'test_budget_for_items',
        id: `item_${number}`,
      };
    });
    await database.addManyDocuments(Collections.Items, testItems);

    // Test if we can get those items
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

  test('function return empty array on nonexistent budget', async () => {
    // Add items to a budget
    const testItems: Item[] = [1, 2, 3].map(number => {
      return {
        ...defaultTestItem,
        budget_id: 'test_budget_for_items',
        id: `item_${number}`,
      };
    });
    await database.addManyDocuments(Collections.Items, testItems);

    // Test if we can get items from a non-existant budget
    const items: Item[] = await dataModel.getItemsForBudget(
      'budget_5',
      new Sort('id')
    );
    assert.equal(items.length, 0);
  });

  test('addItem correctly adds one item to a budget', {retry: 3}, async () => {
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

  test('addItems correctly adds items to a budget', {retry: 3}, async () => {
    const items: Item[] = [1, 2, 3].map(number => {
      return {
        ...defaultTestItem,
        budget_id: 'test_budget_for_add_items',
        id: `item_add_item${number}`,
      };
    });
    await dataModel.addItems(items);
    const test_budget_upd = await dataModel.getBudget(
      'test_budget_for_add_items'
    );
    // We add one to items.length because of the item we added in the test above
    assert.equal(test_budget_upd.total_cost, items.length * 10 * 2);

    assert.deepEqual(items, items);
  });
});
