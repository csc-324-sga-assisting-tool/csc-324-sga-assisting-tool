'use server';
import {revalidatePath} from 'next/cache';
import {createBudget, DataModel, EventType, Database} from 'lib/data';

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
    await createBudget({
      dataModel,
      user_id,
      event_name,
      event_description,
      event_location,
      event_datetime: event_date,
      event_type,
    })
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
  const dataModel = new DataModel(Database);
  await TESTcreateBudgetAction(
    dataModel,
    user_id,
    user_name,
    event_name,
    event_description,
    event_location,
    event_date,
    event_type
  );
  revalidatePath('/dashboard');
}
