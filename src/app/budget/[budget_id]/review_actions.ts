'use server';
import {revalidatePath} from 'next/cache';
import {Budget, DataModel, Database} from 'lib/data';
import {redirect} from 'next/navigation';

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
  // Commit all the comments for each item
  dataModel.pushAllBudgetComments(budget.id);

  // TODO: Change budget status to denied
  // Redirect to the dashboard
  revalidatePath('/dashboard');
  revalidatePath(`/budget/${budget.id}`);
  redirect('/dashboard');
}
export async function denyBudgetAction(budget: Budget): Promise<void> {
  TESTdenyBudgetAction(new DataModel(Database), budget);
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

export type ReviewActionController = {
  approveBudget: (budget: Budget) => Promise<void>;
  denyBudget: (budget: Budget) => Promise<void>;
  clearComments: (budget: Budget) => Promise<void>;
};
