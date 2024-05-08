'use server';
import {revalidatePath} from 'next/cache';
import {Budget, DataModel, EventType, Database} from 'lib/data';
import {forceAlphanumeric, normalizeID} from 'lib/util';

function createBudget(
  user_id: string,
  user_name: string,
  event_name: string,
  event_description: string,
  event_location: string,
  event_datetime: string,
  event_type: EventType
): Budget {
  // Create the id by stripping
  const id = forceAlphanumeric(
    normalizeID(`${user_id}-${event_name}-${new Date().getSeconds()}`)
  );
  return {
    id,
    user_id,
    user_name,
    event_name,
    event_description,
    event_location,
    event_datetime,
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
}

export async function TESTcreateBudgetAction(
  dataModel: DataModel,
  user_id: string,
  user_name: string,
  event_name: string,
  event_description: string,
  event_location: string,
  event_date: string,
  event_type: EventType
): Promise<void> {
  return dataModel.addBudget(
    createBudget(
      user_id,
      user_name,
      event_name,
      event_description,
      event_location,
      event_date,
      event_type
    )
  );
}

export async function createBudgetAction(
  user_id: string,
  user_name: string,
  event_name: string,
  event_description: string,
  event_location: string,
  event_date: string,
  event_type: EventType
): Promise<void> {
  const budget = createBudget(
    user_id,
    user_name,
    event_name,
    event_description,
    event_location,
    event_date,
    event_type
  );
  const modifier = new DataModel(Database);
  const result = modifier.addBudget(budget);
  revalidatePath('/dashboard');
  return result;
}

export async function duplicateBudgetAction(budget: Budget) {
  const modifier = new DataModel(Database);
  const newId = forceAlphanumeric(
    normalizeID(
      `${budget.user_id}-${budget.event_name}-${new Date().getSeconds()}`
    )
  );
  modifier.duplicateBudget(budget, newId);
  revalidatePath('/dashboard');
}

// export async function deleteBudgetAction(budget: Budget) {
//   const modifier = new DataModel(Database);
//   await modifier.deleteBudget(budget); // Assuming this method is implemented in your DataModel, need to change this
//   revalidatePath('/dashboard');
// }
