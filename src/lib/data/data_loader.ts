import {Budget, Item} from '.';

interface DataProvider {
  getBudget(budgetID: string): Promise<Budget>;
  getUserBudgets(userID: string): Promise<Budget[]>;
  addBudgetId(budgetID: string, budget: Budget): void;
  addBudget(budget: Budget): Promise<string>;
  makeBudget(
    UserId: string,
    budgetId: string,
    name: string,
    description: string,
    cost: number,
    want: Item[]
  ): Budget;
}

export type {DataProvider};
