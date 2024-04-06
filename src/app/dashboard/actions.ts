'use server';

import {Budget, DataModifier, FirebaseModifier} from 'lib/data';

export async function createBudget(
  user_id: string,
  event_name: string,
  event_description: string
): Promise<void> {
  const dataModifier: DataModifier = FirebaseModifier;
  const budget_id = `${user_id}-${event_name}-${new Date().getSeconds()}`;
  const budget: Budget = {
    budget_id,
    user_id,
    event_name,
    event_description,
    total_cost: 0,
    items: [],
    current_status: 'created',
    status_history: [
      {
        status: 'created',
        when: new Date().toISOString(),
      },
    ],
  };
  console.log(budget);
  return await dataModifier.addBudget(budget);
}
