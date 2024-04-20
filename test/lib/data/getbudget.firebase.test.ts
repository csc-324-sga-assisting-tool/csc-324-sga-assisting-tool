import {assert, beforeAll, it, describe, expect} from 'vitest';
import {getFirestore} from 'firebase/firestore';
import {Budget, DataModel} from 'lib/data';
import {getLocalFirebase} from '../../utils/database.util';
import {Collections} from 'lib/firebase';

const db = getFirestore();
const database = getLocalFirebase(db);

beforeAll(async () => {
  const testBudgets: Budget[] = [1, 2, 3].map(number => {
    return {
      id: `budget_${number}`,
      user_id: 'user_1',
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
    };
  });

  testBudgets.push({
    id: 'budget_user_2',
    user_id: 'user_2',
    event_name: 'event_name',
    event_description: 'test description',
    total_cost: 100,
    current_status: 'created',
    status_history: [
      {
        status: 'created',
        when: new Date('2001-01-01').toISOString(),
      },
    ],
    items: [],
  });

  await database.addDocuments(Collections.Budgets, testBudgets);
});

describe('test firebase getBudget', async () => {
  // dummy budgets for testing the getBudget function
  const dataModel = new DataModel(database);
  it('function gets correct budget', async () => {
    const budget = await dataModel.getBudget('budget_1');
    assert.equal(budget!.id, 'budget_1');
  });

  it('function errors on nonexistent budget', async () => {
    await expect(
      async () => await dataModel.getBudget('budget_5')
    ).rejects.toThrowError();
  });
});

describe('test getBudetsForUser', async () => {
  const dataModel = new DataModel(database);
  test('function gets all correct budgets user 1', async () => {
    const budgets = await dataModel.getBudgetsForUser('user_1');
    assert.equal(
      budgets.length,
      3,
      `user_1 has 3 budgets but call returned ${budgets.length}`
    );
  });

  test('function gets all correct budgets user 2', async () => {
    const budgets = await dataModel.getBudgetsForUser('user_2');
    assert.equal(
      budgets.length,
      1,
      `user_2 has 1 budgets but call returned ${budgets.length}`
    );
  });
});
