import {Budget} from '.';
import {User} from '.';
interface DataProvider {
  getBudget(budgetID: string): Promise<Budget | undefined>;
  getUserBudgets(userID: string): Promise<Budget[]>;
  getUser(userID: string): Promise<User | undefined>;
}

interface DataModifier {
  addBudget(budget: Budget): Promise<void>;
}

export type {DataProvider, DataModifier};
