import {getBudget} from 'lib/data';
import {expect, test} from 'vitest';

test('getBudget', async () => {
  const id = '1';
  const budget = await getBudget(id);
  expect(budget.budget_id === id);
});
