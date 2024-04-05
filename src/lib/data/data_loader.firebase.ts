import {Budget, Item} from './data_types';
import {
  db,
  getBudgetFirebase,
  getUserBudgetsFirebase,
  addBudgetFirebase,
  addBudgetFirebaseNoId,
} from 'lib/firebase';
import {Firestore} from 'firebase/firestore';
import {DataProvider} from './data_loader';

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

export async function addBudgetId(
  budget_id: string,
  budget: Budget,
  datastore: Firestore = db
) {
  addBudgetFirebase(budget_id, datastore, budget);
}

export async function addBudget(
  budget: Budget,
  datastore: Firestore = db
): Promise<string> {
  return addBudgetFirebaseNoId(datastore, budget);
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

  async addBudgetId(budgetID: string, budget: Budget) {
    addBudgetId(budgetID, budget);
  },

  async addBudget(budget: Budget): Promise<string> {
    return addBudget(budget);
  },

  makeBudget(
    UserId: string,
    budgetId: string,
    name: string,
    description: string,
    cost: number,
    want: Item[]
  ): Budget {
    const new_Date: Date = new Date();
    // Converting date to string
    const result: string = new_Date.toLocaleString();
    const budget: Budget = {
      user_id: UserId, // the user this budget belongs to
      budget_id: budgetId,
      event_name: name,
      event_description: description,
      total_cost: cost,
      current_status: 'created',
      status_history: [{status: 'created', when: result}],
      items: [],
    };
    return budget;
  },
};
