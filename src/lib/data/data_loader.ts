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
    filters: Filter[] = [],
    howMany = 25,
    sort?: Sort
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
    filters: Filter[] = [],
    sort?: Sort,
    howMany = 25
  ): Promise<Budget[]> {
    filters.push(new Filter('user_id', '==', user_id));
    return this.getBudgets(filters, howMany, sort);
  }

  async addBudget(budget: Budget): Promise<void> {
    const user_id = budget.user_id;
    const user = (await this.getUser(user_id)) as User;
    user.planned_event += 1;
    await this.database.addDocument(Collections.Users, user);
    return this.database.addDocument(Collections.Budgets, budget);
  }
}
