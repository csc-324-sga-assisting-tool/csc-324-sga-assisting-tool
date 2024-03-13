import {getBudget} from 'data';
import {expect, test} from 'vitest';

test('getBudget', () => {
  const id = '1';
  const budget = getBudget(id);
  expect(budget.budget_id === id);
});
