import {Budget, Item} from '.';
import {IDatabase} from './database';
import {Collections} from '../firebase/config';
import {Filter, Sort} from './database';
import {FirestoreDatabase} from './database.firebase';
import {db} from 'lib/firebase';
import {Abel} from 'next/font/google';

class DataProvider {
  database: IDatabase;
  constructor(database: IDatabase = new FirestoreDatabase(db)) {
    this.database = database;
  }

  // Get a budget by ID
  async getBudget(budgetID: string): Promise<Budget | undefined> {
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

  /* getUserBudgets returns 'howMany' of the userID's most recent budgets
   */
  async getBudgetItems(
    budgetID: string,
    sort: Sort,
    filters: Filter[] = [],
    howMany = 25
  ): Promise<Item[]> {
    filters.push(new Filter('budget_id', '==', budgetID));
    return this.database.getDocuments<Item>(
      Collections.Items,
      filters,
      sort,
      howMany
    );
  }
}

class DataModifier {
  database: IDatabase;
  constructor(database: IDatabase) {
    this.database = database;
  }

  // Adds the given budget to the database and assigns it an ID
  async addBudget(budget: Budget): Promise<void> {
    const id = await this.database.addDocument(Collections.Budgets, budget);
    budget.id = id;
  }
}

export type {DataProvider, DataModifier};
