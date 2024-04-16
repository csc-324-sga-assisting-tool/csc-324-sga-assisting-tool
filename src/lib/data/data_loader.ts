import {Budget, User} from '.';
import {IDatabase} from './database';
import {Collections} from '../firebase/config';
import {Filter, Sort, Database} from './database';

export class DataProvider {
  setBudgets(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    arg0: {
      user_id: string;
      budget_id: string;
      event_name: string;
      event_description: string;
      current_status: string;
      total_cost: number;
      status_history: {status: string; when: string}[];
      items: never[];
    }[]
  ) {
    throw new Error('Method not implemented.');
  }
  database: IDatabase;
  constructor(database: IDatabase = Database) {
    this.database = database;
  }

  // Get a budget by ID
  getBudget(budgetID: string): Promise<Budget | undefined> {
    return this.database.getDocument<Budget>(Collections.Budgets, budgetID);
  }

  getUser(userID: string): Promise<User | undefined> {
    return this.database.getDocument<User>(Collections.Users, userID);
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
  // Get a sorted and filtered list of budgets from a particular user
  getUserBudgets(
    user_id: string,
    sort: Sort = new Sort('id'),
    filters: Filter[] = [],
    howMany = 25
  ): Promise<Budget[]> {
    return this.getBudgets(
      sort,
      filters.concat([new Filter('id', '==', user_id)]),
      howMany
    );
  }
}

export class DataModifier {
  database: IDatabase;
  constructor(database: IDatabase = Database) {
    this.database = database;
  }

  // Adds the given budget to the database and assigns it an ID
  async addBudget(budget: Budget): Promise<void> {
    const id = await this.database.addDocumentWithAutoID(
      Collections.Budgets,
      budget
    );
    budget.id = id;
  }
}
