import {assert, beforeAll, it, describe, expect} from 'vitest';
import {getFirestore} from 'firebase/firestore';
import {Budget, DataModel, Item, User} from 'lib/data';
import {Collections} from 'lib/firebase';
import {getLocalFirebase, clearCollection} from '../../utils/database.util';
import {beforeEach} from 'node:test';

/*
const db = getFirestore();
const database = getLocalFirebase(db);

beforeEach(async () => {
  await clearCollection(database, Collections.Users);
  await clearCollection(database, Collections.Budgets);
  await clearCollection(database, Collections.Items);

  const testUser: User[] = [1, 2, 3].map(number => {
    return {
      id: `test_user${number}`,
      name: 'test_user1',
      total_budget: 2000,
      remaining_budget: 1000,
      pending_event: 5,
      completed_event: 10,
      planned_event: 5,
      user_type: 'RSO',
    };
  });

  const testUser.push= ({
    id: 'user_status_test',
    name: 'user_status1',
    remaining_budget: 500,
    total_budget: 500,
    pending_event: 1,
    planned_event: 1,
    completed_event: 1,
    user_type: 'SEPC',
  });

  const testBudgets: Budget[] = [1, 2, 3].map(number => {
    return {
      id: `budget_${number}`,
      user_id: 'user_1',
      user_name: 'user_1',
      event_name: `event_name_${number}`,
      event_description: 'test description',
      total_cost: number * 100,
      current_status: 'created',
      status_history: [
        {
          status: 'created',
          when: new Date('2001-01-01').toISOString(),
        },
      ],
      items: [],
      event_type: 'Other',
    };
  });

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
    };
  });



  const testBudget: Budget = {
    id: 'test_budget_for_items',
    user_id: 'user_status_test',
    user_name: 'user_status1',
    event_name: 'test_for_budget_status',
    event_description: 'test_for_budget_status',
    total_cost: 10.0 * 3 * 2,
    current_status: 'created',
    status_history: [],
    items: [],
    event_type: 'Harris',
  };

  const testItem: Item = {
    budget_id: 'test_budget_for_items',
    name: 'item_status_test',
    quantity: 0,
    unit_price: 0,
    vendor: undefined,
    id: 'status_test',
  };

  database.addDocument(Collections.Users, testUser);
  database.addDocument(Collections.Budgets, testBudget);
  database.addDocument(Collections.Items, testItem);
});

describe('Test changeBudgetStatus', async () => {
  const dataModel = new DataModel(database);
  const user = await dataModel.getUser('user_status_test');
  const budget = await dataModel.getBudget('test_budget_for_items');
});
*/
