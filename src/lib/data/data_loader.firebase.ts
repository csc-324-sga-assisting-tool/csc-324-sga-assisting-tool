import {Budget, User} from './data_types';
import {
  db,
  getBudgetFirebase,
  getUserBudgetsFirebase,
  addBudgetFirebase,
} from 'lib/firebase';
import {Firestore} from 'firebase/firestore';
import {DataModifier, DataProvider} from './data_loader';
import {getUserFirebase} from 'lib/firebase/get_user';
import {addUserFirebase} from 'lib/firebase/add_user';

export async function getBudget(
  budget_id: string,
  datastore: Firestore = db
): Promise<Budget | undefined> {
  return getBudgetFirebase(budget_id, datastore);
}

// Added
export async function getUser(
  budget_id: string,
  datastore: Firestore = db
): Promise<User | undefined> {
  return getUserFirebase(budget_id, datastore);
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

export async function addUser(
  user: User,
  datastore: Firestore = db
): Promise<void> {
  return addUserFirebase(user.email, user.password, user, datastore);
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
  // Added
  async getUser(userID: string): Promise<User | undefined> {
    return getUser(userID);
  },
};

export const FirebaseModifier: DataModifier = {
  async addBudget(budget: Budget): Promise<void> {
    return addBudget(budget);
  },

  async addUser(user: User): Promise<void> {
    return addUser(user);
  },
};
