import {Budget} from './data_types';
import {db, getBudgetFirebase, getUserBudgetsFirebase} from 'lib/firebase';
import {Firestore} from 'firebase/firestore';
import {DataProvider} from './data_loader';

export async function getBudget(
  budget_id: string,
  datastore: Firestore = db
): Promise<Budget | undefined> {
  return getBudgetFirebase(budget_id, datastore);
}

export async function getUserBudgets(
  userID: string,
  datastore: Firestore = db
): Promise<Budget[]> {
  return getUserBudgetsFirebase(userID, 25, datastore);
}

/* FirebaseProvider implements data methods using FireBase
 */
export const FirebaseProvider: DataProvider = {
  async getBudget(budgetID: string): Promise<Budget | undefined> {
    return getBudget(budgetID);
  },

  async getUserBudgets(userID: string): Promise<Budget[]> {
    return getUserBudgets(userID);
  },
};
