import {Budget, User} from '.';
import {IDatabase} from './database';
import {Collections} from '../firebase/config';
import {Filter, Sort, Database} from './database';

export class DataModel {
  database: IDatabase;
  constructor(database: IDatabase = Database) {
    this.database = database;
  }

  // Get a budget by ID
  getBudget(budgetID: string): Promise<Budget> {
    return this.database.getDocument<Budget>(Collections.Budgets, budgetID);
  }

  getUser(userID: string): Promise<User> {
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
  getBudgetsForUser(
    user_id: string,
    sort: Sort = new Sort('id'),
    filters: Filter[] = [],
    howMany = 25
  ): Promise<Budget[]> {
    filters.push(new Filter('user_id', '==', user_id));
    return this.getBudgets(sort, filters, howMany);
  }

  // Adds the given budget to the database and assigns it an ID
  async addBudget(budget: Budget): Promise<void> {
    return this.database.addDocument(Collections.Budgets, budget);
  }
}
