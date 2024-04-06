import {Budget} from '.';

interface DataProvider {
  getBudget(budgetID: string): Promise<Budget | undefined>;
  getUserBudgets(userID: string): Promise<Budget[]>;
}

interface DataModifier {
  addBudget(budget: Budget): Promise<void>;
}

export type {DataProvider, DataModifier};
