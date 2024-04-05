import {Budget, Item} from './data_types';
import {
  db,
  getBudgetFirebase,
  getUserBudgetsFirebase,
  addBudgetFirebase,
} from 'lib/firebase';
import {Firestore} from 'firebase/firestore';
import {DataModifier, DataProvider} from './data_loader';

export async function getBudget(
  budget_id: string,
  datastore: Firestore = db
): Promise<Budget> {
  return getBudgetFirebase(budget_id, datastore);
}

export async function getUserBudgets(
  userID: string,
  datastore: Firestore = db
): Promise<Budget[]> {
  return getUserBudgetsFirebase(userID, 25, datastore);
}

export async function addBudget(
  budget: Budget,
  datastore: Firestore = db
): Promise<void> {
  return addBudgetFirebase(budget.budget_id, budget, datastore);
}

/* FirebaseProvider implements data methods using FireBase
 */
export const FirebaseProvider: DataProvider = {
  async getBudget(budgetID: string): Promise<Budget> {
    return getBudget(budgetID);
  },

  async getUserBudgets(userID: string): Promise<Budget[]> {
    return getUserBudgets(userID);
  },
};

export const FirebaseModifier: DataModifier = {
  async addBudget(budget: Budget): Promise<void> {
    return addBudget(budget);
  },
};
