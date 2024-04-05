import {assert, it, describe} from 'vitest';
import {
  connectFirestoreEmulator,
  getFirestore,
  doc,
  setDoc,
} from 'firebase/firestore';
import {Budget, getBudget, getUserBudgets} from 'lib/data';
import {
  Collection,
  getBudgetFirebase,
  getUserBudgetsFirebase,
} from 'lib/firebase';

const db = getFirestore();
connectFirestoreEmulator(db, '127.0.0.1', 5000);

describe('test firebase getBudget', () => {
  // dummy budgets for testing the getBudget function
  const testBudgets: Budget[] = [1, 2, 3].map(number => {
    return {
      budget_id: `budget_${number}`,
      user_id: `user_${number}`,
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

  testBudgets.map(async budget => {
    await setDoc(doc(db, Collection.Budgets, budget.budget_id), budget);
  });

  it('wrapper function gets correct budget', async () => {
    const budget = await getBudget('budget_1', db);
    assert.equal(budget!.budget_id, 'budget_1');
  });

  it('wrapper function gets correct budget', async () => {
    const budget = await getBudget('budget_5', db);
    assert.isUndefined(budget);
  });

  it('firebase function gets correct budget and not the same budget everytime', async () => {
    const id = 'test_b1';
    const budget = await getBudgetFirebase('budget_2', db);
    assert.equal(budget!.budget_id, 'budget_2');
  });
});

describe('test firebase getUserBudget', () => {
  // dummy budgets for testing the getUserBudgets function
  const testBudgets: Budget[] = [1, 2, 3].map(number => {
    return {
      budget_id: `budget_${number}`,
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
    budget_id: 'budget_user_2',
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

  testBudgets.map(async budget => {
    await setDoc(doc(db, Collection.Budgets, budget.budget_id), budget);
  });

  it('wrapper function gets all correct budgets', async () => {
    const budgets = await getUserBudgets('user_1', db);
    assert.equal(
      budgets.length,
      3,
      `user_1 has 3 budgets but call returned ${budgets.length}`
    );
    budgets.map(budget => assert.equal(budget.user_id, 'user_1'));
  });

  it('wrapper function gets all correct budgets', async () => {
    const budgets = await getUserBudgets('user_2', db);
    assert.equal(
      budgets.length,
      1,
      `user_2 has 1 budgets but call returned ${budgets.length}`
    );
    budgets.map(budget => assert.equal(budget.user_id, 'user_2'));
  });

  it('firebase function gets all correct budgets', async () => {
    const budgets = await getUserBudgetsFirebase('user_1', 10, db);
    assert.equal(
      budgets.length,
      3,
      `user_1 has 3 budgets but call returned ${budgets.length}`
    );
    budgets.map(budget => assert.equal(budget.user_id, 'user_1'));
  });

  it('firebase function gets all correct budgets', async () => {
    const budgets = await getUserBudgetsFirebase('user_2', 10, db);
    assert.equal(
      budgets.length,
      1,
      `user_2 has 1 budgets but call returned ${budgets.length}`
    );
    budgets.map(budget => assert.equal(budget.user_id, 'user_2'));
  });
});
