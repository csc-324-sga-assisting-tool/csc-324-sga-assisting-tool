'use server';
import {revalidatePath} from 'next/cache';
import {Budget, Item, DataModel, Database} from 'lib/data';
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
  // TODO: Is the redirect necessary if we have a separate submitBudgetAction?
  revalidatePath('/dashboard');
  revalidatePath(`/budget/${budget.id}`);
  if (backToDashboard) {
    redirect('/dashboard');
  }

  return result;
}

export async function TESTclearCommentsAction(
  dataModel: DataModel,
  budget: Budget
): Promise<void> {
  dataModel.clearItemComments(budget.id);
}
export async function clearCommentsAction(budget: Budget): Promise<void> {
  TESTclearCommentsAction(new DataModel(Database), budget);
}

export async function submitBudgetAction(budget: Budget): Promise<void> {
  const modifier = new DataModel(Database);
  await modifier.submitBudget(budget.id);

  revalidatePath('/dashboard');
  revalidatePath(`/budget/${budget.id}`);
  redirect('/dashboard');
}

function createItem(
  budget_id: string,
  name: string,
  vendor: string,
  unit_price: number,
  quantity: number,
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
    prev_commentIDs: [],
    commentID: '',
  };
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
  return dataModel.addItem(item);
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
  await model.addItem(item);
  revalidatePath(`/budget/${budgetID}`);
}

export async function TESTapproveBudgetAction(
  dataModel: DataModel,
  budget: Budget
): Promise<void> {
  // TODO: Change budget status to approved

  revalidatePath('/dashboard');
  revalidatePath(`/budget/${budget.id}`);
  redirect('/dashboard');
}
export async function approveBudgetAction(budget: Budget): Promise<void> {
  TESTapproveBudgetAction(new DataModel(Database), budget);
}

export async function TESTdenyBudgetAction(
  dataModel: DataModel,
  budget: Budget
): Promise<void> {
  dataModel.pushAllBudgetComments(budget.id);
  // TODO: Change budget status to denied
  revalidatePath('/dashboard');
  revalidatePath(`/budget/${budget.id}`);
  redirect('/dashboard');
}
export async function denyBudgetAction(budget: Budget): Promise<void> {
  TESTdenyBudgetAction(new DataModel(Database), budget);
}

type UIState = {
  submit: 'approve' | 'deny';
  showClear: boolean;
};
export async function TESTgetUIState(
  dataModel: DataModel,
  budget: Budget
): Promise<UIState> {
  const denied = budget.denied_items.length > 0;
  return {
    submit: denied ? 'approve' : 'deny',
    showClear: denied,
  };
}
export async function getUIState(budget: Budget): Promise<UIState> {
  return TESTgetUIState(new DataModel(Database), budget);
}
