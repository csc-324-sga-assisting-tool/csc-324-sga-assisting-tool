import {assert, beforeAll, it, describe} from 'vitest';
import {Budget, Item, Sort, DataModel, User} from 'lib/data';
import {getFirestore} from 'firebase/firestore';
import {getLocalFirebase, clearCollection} from '../../utils/database.util';
import {Collections} from 'lib/firebase';
import {
  createItem,
  createBudget,
  createBudgetSync,
  createUser,
} from 'lib/data/utils';

const db = getFirestore();
const database = getLocalFirebase(db);
beforeAll(async () => {
  await clearCollection(database, Collections.Users);
  await clearCollection(database, Collections.Budgets);
  await clearCollection(database, Collections.Items);

  const testItems: Item[] = [1, 2, 3].map(number => {
    return createItem({
      budget_id: 'test_budget_for_items',
      unit_price: 10.0,
      id: `item_${number}`,
      name: `testing item ${number}`,
      quantity: 2,
      url: 'test',
      vendor: 'test',
    });
  });
  const testBudget: Budget = createBudgetSync({
    id: 'test_budget_for_items',
    user_id: 'user_items', // the user this budget belongs to
    user_name: 'user_items',
    event_name: 'test_for_items',
    event_description: 'test_for_items',
    event_type: 'Harris',
  });

  const addItemTestBudget: Budget = createBudgetSync({
    id: 'test_budget_for_add_items',
    user_id: 'user_items', // the user this budget belongs to
    user_name: 'user_items',
    event_name: 'test_for_add_items',
    event_description: 'test_for_add_items',
    event_type: 'Harris',
  });

  const testUser: User = createUser({
    id: 'user_items',
    name: 'user_items',
    remaining_budget: 500,
    total_budget: 500,
    pending_event: 1,
    planned_event: 1,
    completed_event: 1,
    user_type: 'SEPC',
  });

  await database.addManyDocuments(Collections.Items, testItems);
  await database.addDocument(Collections.Budgets, testBudget);
  await database.addDocument(Collections.Budgets, addItemTestBudget);
  await database.addDocument(Collections.Users, testUser);
});

describe('Test getBudgetItems', async () => {
  const dataModel = new DataModel(database);

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
  const dataModel = new DataModel(database);

  it('addItem correctly adds one item to a budget', async () => {
    const item: Item = {
      budget_id: 'test_budget_for_add_items',
      unit_price: 10.0,
      id: 'test_additem',
      name: 'testing additem',
      quantity: 2,
      rso_item_comment: null,
      sga_item_comment: null,
      url: 'test',
      vendor: 'test',
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
        budget_id: 'test_budget_for_add_items',
        unit_price: 10.0,
        id: `item_add_item${number}`,
        name: `testing add_item ${number}`,
        quantity: 2,
        rso_item_comment: null,
        sga_item_comment: null,
        url: 'test',
        vendor: 'test',
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
