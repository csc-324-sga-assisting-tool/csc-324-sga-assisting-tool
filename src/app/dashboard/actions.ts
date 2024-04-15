'use server';
import {revalidatePath} from 'next/cache';
import {Budget, DataModifier, FirebaseModifier} from 'lib/data';

function createBudget(
  user_id: string,
  event_name: string,
  event_description: string
): Budget {
  const budget_id = `${user_id}-${event_name}-${new Date().getSeconds()}`;
  return {
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
}

export async function TESTcreateBudgetAction(
  dataModifier: DataModifier = FirebaseModifier,
  user_id: string,
  event_name: string,
  event_description: string
): Promise<void> {
  return dataModifier.addBudget(
    createBudget(user_id, event_name, event_description)
  );
}

export async function createBudgetAction(
  user_id: string,
  event_name: string,
  event_description: string
): Promise<void> {
  const budget = createBudget(user_id, event_name, event_description);
  const result = FirebaseModifier.addBudget(budget);
  revalidatePath('/dashboard');
  return result;
}
