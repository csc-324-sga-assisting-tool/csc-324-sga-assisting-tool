import {Budget} from '.';

interface DataProvider {
  getBudget(budgetID: string): Promise<Budget>;
  getUserBudgets(userID: string): Promise<Budget[]>;
}

interface DataModifier {
  addBudget(budget: Budget): Promise<void>;
}

export type {DataProvider, DataModifier};
