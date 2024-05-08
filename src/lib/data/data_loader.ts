import {Budget, Item, User} from '.';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {IDatabase} from './database';
import {Collections} from '../firebase/config';
import {Filter, Sort, Database} from './database';
import {forceAlphanumeric, normalizeID} from 'lib/util';

export class DataModel {
  static getBudgets() {
    throw new Error('Method not implemented.');
  }
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
    sort?: Sort,
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
    howMany = 25,
    sort?: Sort
  ): Promise<Budget[]> {
    filters.push(new Filter('user_id', '==', user_id));
    return this.getBudgets(filters, howMany, sort);
  }

  // Get a sorted and filtered list of submitted budgetes
  getBudgetsSubmitted(
    filters: Filter[] = [],
    howMany = 25,
    sort?: Sort
  ): Promise<Budget[]> {
    filters.push(new Filter('current_status', '==', 'submitted'));
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
    try {
      const budget: Budget = await this.getBudget(item.budget_id);
      const user: User = await this.getUser(budget.user_id);
      const total = item.unit_price * item.quantity;
      budget.total_cost += total;
      user.remaining_budget -= total;

      // Write changes to Firestore
      await this.addBudget(budget);
      await this.updateUser(user);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async addItems(items: Item[]): Promise<void> {
    if (items.length === 0) return Promise.resolve();
    let sameBudget = true;
    const lastId = items[0].budget_id;
    items.forEach(
      item => (sameBudget = sameBudget && lastId === item.budget_id)
    );
    if (!sameBudget) {
      return Promise.reject(
        new Error('all items passed to addItems should have the same budget_id')
      );
    }
    try {
      const budget: Budget = await this.getBudget(lastId);
      const user: User = await this.getUser(budget.user_id);
      const total: number = items.reduce((cumulative, current) => {
        return cumulative + current.unit_price * current.quantity;
      }, 0);
      budget.total_cost += total;
      user.remaining_budget -= total;
      // Write changes to Firestore
      await this.database.addManyDocuments(Collections.Items, items);
      await this.addBudget(budget);
      await this.updateUser(user);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async updateUser(user: User): Promise<void> {
    await this.database.addDocument(Collections.Users, user);
  }

  //These should be moved
  async addUser(email: string, password: string, user: User): Promise<void> {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password);
    await this.database.addDocument(Collections.Users, user);
  }

  async signOutUser() {
    const auth = getAuth();
    try {
      await signOut(auth);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async signInUser(email: string, password: string) {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password);
  }

  async duplicateBudget(budget: Budget, newId: string): Promise<void> {
    const today = new Date();
    const budgetDate = budget.event_datetime
      ? new Date(budget.event_datetime)
      : today;
    const newBudgetDate = budgetDate >= today ? budgetDate : today;
    const newName = `${budget.event_name} - Copy`;

    const newBudget: Budget = {
      ...budget,
      total_cost: 0,
      id: newId,
      current_status: 'created',
      status_history: [{status: 'created', when: today.toISOString()}],
      event_name: newName,
      event_datetime: newBudgetDate.toISOString(),
    };
    await this.addBudget(newBudget);
    const items = await this.getItemsForBudget(budget.id);
    const duplicatedItems = items.map(item => ({
      ...item,
      id: `${item.id}${newId}`,
      budget_id: newId,
    }));
    for (const item of duplicatedItems) {
      await this.addItem(item);
    }
  }
}
