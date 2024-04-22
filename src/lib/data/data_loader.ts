import {Budget, Item, User} from '.';
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

  /* getItemsForBudget returns 'howMany' items in budget 'budgetID's'
   */
  async getItemsForBudget(
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
  getBudgetsForUser(
    user_id: string,
    filters: Filter[] = [],
    sort?: Sort,
    howMany = 25
  ): Promise<Budget[]> {
    filters.push(new Filter('user_id', '==', user_id));
    return this.getBudgets(filters, howMany, sort);
  }

  // Adds the given budget to the database
  // If budget does not have an ID, assigns it one
  // Else, use ID to get document from database
  async addBudget(budget: Budget): Promise<void> {
    return this.database.addDocument(Collections.Budgets, budget);
  }
  async addItem(item: Item): Promise<void> {
    await this.database.addDocument(Collections.Items, item);

    const budget: Budget = await this.getBudget(item.budget_id);
    const user: User = await this.getUser(budget.user_id);
    const total = item.cost * item.quantity;
    budget.total_cost += total;
    user.remaining_budget -= total;

    // Write changes to Firestore
    await this.addBudget(budget);
    await this.updateUser(user);
  }

  async updateUser(user: User): Promise<void> {
    await this.database.addDocument(Collections.Users, user);
  }
}
