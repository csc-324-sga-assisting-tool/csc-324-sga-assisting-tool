import {Budget} from '.';
import {IDatabase} from './database';
import {Collections} from '../firebase/config';
import {Filter, Sort, Database} from './database';

class DataProvider {
  database: IDatabase;
  constructor(database: IDatabase = Database) {
    this.database = database;
  }

  // Get a budget by ID
  getBudget(budgetID: string): Promise<Budget | undefined> {
    return this.database.getDocument<Budget>(Collections.Budgets, budgetID);
  }
  // Get a sorted and filtered list of budgets
  getBudgets(filters: Filter[], sort: Sort, howMany = 25): Promise<Budget[]> {
    return this.database.getDocuments<Budget>(
      Collections.Budgets,
      filters,
      sort,
      howMany
    );
  }
}

class DataModifier {
  database: IDatabase;
  constructor(database: IDatabase = Database) {
    this.database = database;
  }

  // Adds the given budget to the database and assigns it an ID
  async addBudget(budget: Budget): Promise<void> {
    const id = await this.database.addDocument(Collections.Budgets, budget);
    budget.id = id;
  }
}

export type {DataProvider, DataModifier};
