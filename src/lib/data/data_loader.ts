import {Budget} from '.';

interface DataProvider {
  getBudget(budgetID: string): Promise<Budget>;
  getUserBudgets(userID: string): Promise<Budget[]>;
}

export type {DataProvider};
