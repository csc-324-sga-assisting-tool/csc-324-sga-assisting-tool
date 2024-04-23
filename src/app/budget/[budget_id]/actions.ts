'use server';
import {revalidatePath} from 'next/cache';
import {Budget, Item, DataModel, Database} from 'lib/data';
import {normalizeID} from 'lib/util';

export async function TESTupdateBudgetAction(
  dataModel: DataModel,
  budget: Budget
): Promise<void> {
  return dataModel.addBudget(budget);
}

export async function updateBudgetAction(budget: Budget): Promise<void> {
  const modifier = new DataModel(Database);
  const result = modifier.addBudget(budget);
  revalidatePath('/dashboard');
  return result;
}

function createItem(
  budget_id: string,
  name: string,
  vendor: string,
  unit_price: number,
  quantity: number,
  url?: string
): Item {
  const id = normalizeID(
    `${budget_id}-${vendor}-${name}-${new Date().getSeconds()}`
  );
  return {id, budget_id: budget_id, name, vendor, url, unit_price, quantity};
}

export async function TESTcreateItemAction(
  dataModel: DataModel,
  budgetID: string,
  name: string,
  vendor: string,
  unit_price: number,
  quantity: number,
  url?: string
) {
  const item = createItem(budgetID, name, vendor, unit_price, quantity, url);
  // TODO: comment out once implemented
  //return dataModel.addItem(item)
}

export async function createItemAction(
  budgetID: string,
  name: string,
  vendor: string,
  unit_price: number,
  quantity: number,
  url?: string
) {
  const item = createItem(budgetID, name, vendor, unit_price, quantity, url);
  const model = new DataModel(Database);
  // TODO: comment out once implemented
  // const result = modifier.addItem(item)
  revalidatePath('/dashboard');
}
