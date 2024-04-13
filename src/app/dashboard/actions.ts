'use server';
import {revalidatePath} from 'next/cache';
import {Budget, DataModifier} from 'lib/data';

export async function createBudget(
  user_id: string,
  event_name: string,
  event_description: string
): Promise<void> {
  const dataModifier: DataModifier = new DataModifier();
  const id = `${user_id}-${event_name}-${new Date().getSeconds()}`;
  const budget: Budget = {
    id,
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

  revalidatePath('/dashboard');
  return await dataModifier.addBudget(budget);
}
