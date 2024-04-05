import {Budget} from '.';

interface DataProvider {
  getBudget(budgetID: string): Promise<Budget | undefined>;
  getUserBudgets(userID: string): Promise<Budget[]>;
}

export type {DataProvider};
