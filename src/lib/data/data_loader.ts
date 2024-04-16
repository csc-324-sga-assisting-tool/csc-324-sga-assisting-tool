import {Budget, Item} from '.';
import {IDatabase} from './database';
import {Collections} from '../firebase/config';
import {Filter, Sort, Database} from './database';

export class DataProvider {
  database: IDatabase;
  constructor(database: IDatabase = Database) {
    this.database = database;
  }

  // Get a budget by ID
  async getBudget(budgetID: string): Promise<Budget | undefined> {
    return this.database.getDocument<Budget>(Collections.Budgets, budgetID);
  }
  // Get a sorted and filtered list of budgets
  getBudgets(
    sort: Sort,
    filters: Filter[] = [],
    howMany = 25
  ): Promise<Budget[]> {
    return this.database.getDocuments<Budget>(
      Collections.Budgets,
      filters,
      sort,
      howMany
    );
  }

  /* getBudgetItems returns 'howMany' items in budget 'budgetID's'
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

  // Get a sorted and filtered list of budgets from a particular user
  getUserBudgets(
    user_id: string,
    sort: Sort = new Sort('id'),
    filters: Filter[] = [],
    howMany = 25
  ): Promise<Budget[]> {
    return this.getBudgets(
      sort,
      filters.concat([new Filter('user_id', '==', user_id)]),
      howMany
    );
  }
}

export class DataModifier {
  database: IDatabase;
  constructor(database: IDatabase = Database) {
    this.database = database;
  }

  // Adds the given budget to the database
  // If budget does not have an ID, assigns it one
  // Else, use ID to get document from database
  async addBudget(budget: Budget): Promise<void> {
    if (budget.id === '') {
      const id = await this.database.addDocument(Collections.Budgets, budget);
      budget.id = id;
    } else {
      await this.database.addDocumentWithId(Collections.Budgets, budget);
    }
  }
  async addItem(item: Item): Promise<void> {
    if (item.id === '') {
      const id = await this.database.addDocument(Collections.Items, item);
      item.id = id;
    } else {
      await this.database.addDocumentWithId(Collections.Items, item);
    }
  }
}
