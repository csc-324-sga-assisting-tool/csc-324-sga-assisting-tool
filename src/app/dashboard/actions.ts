'use server';
import {revalidatePath} from 'next/cache';
import {Budget, DataModifier, FirebaseModifier} from 'lib/data';

export async function TESTcreateBudgetAction(
  dataModifier: DataModifier = FirebaseModifier,
  user_id: string,
  event_name: string,
  event_description: string
): Promise<void> {
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

  return dataModifier.addBudget(budget);
}

export async function createBudgetAction(
  user_id: string,
  event_name: string,
  event_description: string
): Promise<void> {
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

  const result = FirebaseModifier.addBudget(budget);
  revalidatePath('/dashboard');
  return result;
}
