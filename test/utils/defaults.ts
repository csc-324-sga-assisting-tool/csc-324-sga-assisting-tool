import {User, Budget, Item} from 'lib/data';

// This file exists so tests can reuse these fake mock types
// whenever updating data types, we can change them here so tests don't break
export const defaultTestUser: User = {
  id: 'test_user',
  total_budget: 2000,
  remaining_budget: 2000,
  pending_event: 1,
  completed_event: 1,
  planned_event: 1,
  name: 'test_user',
  user_type: 'RSO',
};

export const defaultTestBudget: Budget = {
  id: 'test_budget',
  user_id: 'test_user',
  user_name: 'test_user',
  event_name: 'event_name',
  event_description: 'test description',
  event_type: 'Food',
  total_cost: 0,
  current_status: 'created',
  status_history: [
    {
      status: 'created',
      when: new Date('2001-01-01').toISOString(),
    },
  ],
};

export const defaultTestItem: Item = {
  budget_id: 'test_budget_for_items',
  unit_price: 10,
  id: 'test_item',
  name: 'testing item',
  quantity: 2,
  current_status: 'created',
  url: 'test',
  vendor: 'test',
};
