'use server';
import {DataModel, Budget} from 'lib/data';
import {normalizeID, forceAlphanumeric} from 'lib/util';

export async function duplicateBudgetAction(
  dataModel: DataModel,
  budget: Budget
): Promise<void> {
  const today = new Date();
  const budgetDate = budget.event_datetime
    ? new Date(budget.event_datetime)
    : today;
  const newBudgetDate = budgetDate >= today ? budgetDate : today;
  const newName = `${budget.event_name} - Copy`;
  const newId = forceAlphanumeric(
    normalizeID(`${budget.user_id}-${newName}-${new Date().getSeconds()}`)
  );
  // generateNewBudgetId();

  const newBudget: Budget = {
    ...budget,
    id: newId,
    event_name: newName,
    event_datetime: newBudgetDate.toISOString(),
  };

  await dataModel.addBudget(newBudget);

  const items = await dataModel.getItemsForBudget(budget.id);
  const duplicatedItems = items.map(item => ({
    ...item,
    budgetId: newId,
  }));

  for (const item of duplicatedItems) {
    await dataModel.addItem(item);
  }
}
