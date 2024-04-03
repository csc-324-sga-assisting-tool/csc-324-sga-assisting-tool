import {Budget} from './data_types';
import {db, getBudgetFirebase, getUserBudgetsFirebase} from 'lib/firebase';
import {Firestore} from 'firebase/firestore';

async function getBudget(
  budget_id: string,
  datastore: Firestore = db
): Promise<Budget> {
  return getBudgetFirebase(budget_id, datastore);
}

async function getUserBudgets(
  userID: string,
  datastore: Firestore = db
): Promise<Budget[]> {
  return getUserBudgetsFirebase(userID, 25, datastore);
}

export {getBudget, getUserBudgets};
