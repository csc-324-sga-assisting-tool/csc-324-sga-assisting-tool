'use server';
import {revalidatePath} from 'next/cache';
import {Budget, Item, DataModel, Database, Status} from 'lib/data';
import {forceAlphanumeric, normalizeID} from 'lib/util';
import {redirect} from 'next/navigation';

export async function TESTupdateBudgetAction(
  dataModel: DataModel,
  budget: Budget,
  backToDashboard = false
): Promise<void> {
  return dataModel.addBudget(budget);
}

export async function updateBudgetAction(
  budget: Budget,
  backToDashboard = false
): Promise<void> {
  const modifier = new DataModel(Database);
  const result = modifier.addBudget(budget);
  revalidatePath('/dashboard');
  revalidatePath(`/budget/${budget.id}`);
  if (backToDashboard) {
    redirect('/dashboard');
  }
  return result;
}

function createItem(
  budget_id: string,
  name: string,
  vendor: string,
  unit_price: number,
  quantity: number,
  current_status: Status,
  url?: string
): Item {
  const id = forceAlphanumeric(
    normalizeID(`${budget_id}-${vendor}-${name}-${new Date().getSeconds()}`)
  );
  return {
    id,
    budget_id,
    name,
    vendor,
    url,
    unit_price,
    quantity,
    current_status,
  };
}

export async function TESTcreateItemAction(
  dataModel: DataModel,
  budgetID: string,
  name: string,
  vendor: string,
  unit_price: number,
  quantity: number,
  current_status: Status,
  url?: string
) {
  const item = createItem(
    budgetID,
    name,
    vendor,
    unit_price,
    quantity,
    current_status,
    url
  );
  return dataModel.addItem(item);
}

export async function createItemAction(
  budgetID: string,
  name: string,
  vendor: string,
  unit_price: number,
  quantity: number,
  current_status: Status,
  url?: string
) {
  const item = createItem(
    budgetID,
    name,
    vendor,
    unit_price,
    quantity,
    current_status,
    url
  );
  const model = new DataModel(Database);
  await model.addItem(item);
  revalidatePath(`/budget/${budgetID}`);
}
