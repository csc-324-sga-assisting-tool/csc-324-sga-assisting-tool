import {assert, beforeEach, it, describe, expect, test} from 'vitest';
import {Budget, DataModel} from 'lib/data';
import {getLocalFirebase, clearCollection} from '../../utils/database.util';
import {Collections} from 'lib/firebase';
import {
  createItem,
  createBudget,
  createBudgetSync,
  createUser,
  createComment,
} from 'lib/data/utils';
import {getFirestore, waitForPendingWrites} from 'firebase/firestore';
import {defaultTestBudget} from '../../utils/defaults';

const db = getFirestore();
const database = getLocalFirebase(db);

beforeEach(async () => {
  const testBudgets: Budget[] = [1, 2, 3].map(number => {
    return createBudgetSync({
      id: `get_budget_test_budget_${number}`,
      user_id: 'get_budget_test_user_1',
      user_name: 'get_budget_test_user_1',
      event_name: `event_name_${number}`,
      event_description: 'test description',
      event_type: 'Other',
    });
  });

  testBudgets.push(
    createBudgetSync({
      id: 'get_budget_test_user_2',
      user_id: 'get_budget_test_user_2',
      user_name: 'test user',
      event_name: 'event_name',
      event_description: 'test description',
      event_type: 'Other',
    })
  );

  await clearCollection(database, Collections.Budgets);
  await database.addManyDocuments(Collections.Budgets, testBudgets);
  await waitForPendingWrites(db);
});

describe('test firebase getBudget', async () => {
  // dummy budgets for testing the getBudget function
  const dataModel = new DataModel(database);
  it('function gets correct budget', async () => {
    const budget = await dataModel.getBudget('get_budget_test_budget_1');
    assert.equal(budget!.id, 'get_budget_test_budget_1');
  });

  it('function errors on nonexistent budget', async () => {
    await expect(
      async () => await dataModel.getBudget('get_budget_test_budget_5')
    ).rejects.toThrowError();
  });
});

describe('test getBudetsForUser', async () => {
  const dataModel = new DataModel(database);
  test('function gets all correct budgets user 1', async () => {
    const budgets = await dataModel.getBudgetsForUser('get_budget_test_user_1');
    assert.equal(
      budgets.length,
      3,
      `get_budget_test_user_1 has 3 budgets but call returned ${budgets.length}`
    );
  });

  test('function gets all correct budgets user 2', async () => {
    const budgets = await dataModel.getBudgetsForUser('get_budget_test_user_2');
    assert.equal(
      budgets.length,
      1,
      `user_2 has 1 budgets but call returned ${budgets.length}`
    );
  });
});
