'use server';

import {Budget, DataModifier, FirebaseModifier} from 'lib/data';

export async function createBudget(
  user_id: string,
  event_name: string,
  event_description: string,
  event_location: string,
  event_date: string,
  event_type: string
): Promise<void> {
  const dataModifier: DataModifier = FirebaseModifier;
  const budget_id = `${user_id}-${event_name}-${new Date().getSeconds()}`;
  const budget: Budget = {
    budget_id,
    user_id,
    event_name,
    event_description,
    event_location,
    // event_date,
    event_type,
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
  return await dataModifier.addBudget(budget);
}
