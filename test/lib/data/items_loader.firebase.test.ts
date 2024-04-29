import {assert, beforeAll, it, describe} from 'vitest';
import {Budget, Item, Sort, DataModel, User} from 'lib/data';
import {getFirestore} from 'firebase/firestore';
import {getLocalFirebase} from '../../utils/database.util';
import {Collections} from 'lib/firebase';

const db = getFirestore();
const database = getLocalFirebase(db);
beforeAll(async () => {
  const testItems: Item[] = [1, 2, 3].map(number => {
    return {
      budget_id: 'test_budget_for_items',
      unit_price: 10.0,
      id: `item_${number}`,
      name: `testing item ${number}`,
      quantity: 2,
      rso_item_comment: null,
      sga_item_comment: null,
      url: 'test',
      vendor: 'test',
      prev_commentIDs: [],
      commentID: '',
    };
  });
  const testBudget: Budget = {
    id: 'test_budget_for_items',
    user_id: 'user_items', // the user this budget belongs to
    user_name: 'user_items',
    event_name: 'test_for_items',
    event_description: 'test_for_items',
    total_cost: 10.0 * 3 * 2,
    current_status: 'created',
    status_history: [],
    event_type: 'Harris',
    prev_commentIDs: [],
    commentID: '',
    denied_items: [],
  };

  const addItemTestBudget: Budget = {
    id: 'test_budget_for_add_items',
    user_id: 'user_items', // the user this budget belongs to
    user_name: 'user_items',
    event_name: 'test_for_add_items',
    event_description: 'test_for_add_items',
    total_cost: 0,
    current_status: 'created',
    status_history: [],
    event_type: 'Harris',
    prev_commentIDs: [],
    commentID: '',
    denied_items: [],
  };

  const testUser: User = {
    id: 'user_items',
    name: 'user_items',
    remaining_budget: 500,
    total_budget: 500,
    pending_event: 1,
    planned_event: 1,
    completed_event: 1,
    user_type: 'SEPC',
  };

  database.addManyDocuments(Collections.Items, testItems);
  database.addDocument(Collections.Budgets, testBudget);
  database.addDocument(Collections.Budgets, addItemTestBudget);
  database.addDocument(Collections.Users, testUser);
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
