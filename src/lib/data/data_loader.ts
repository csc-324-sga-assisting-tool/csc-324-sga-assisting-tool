import {Comment, Budget, Item, User, StatusChange} from '.';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {IDatabase} from './database';
import {Collections} from '../firebase/config';
import {Filter, Sort, Database} from './database';

export class DataModel {
  database: IDatabase;
  constructor(database: IDatabase = Database) {
    this.database = database;
  }

  /** BUDGETS **/
  // Get a budget by ID
  getBudget(budgetID: string): Promise<Budget> {
    return this.database.getDocument<Budget>(Collections.Budgets, budgetID);
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
    const user_id = budget.user_id;
    const user = (await this.getUser(user_id)) as User;
    user.planned_event += 1;
    await this.database.addDocument(Collections.Users, user);
    return this.database.addDocument(Collections.Budgets, budget);
  }

  async submitBudget(budgetID: string): Promise<void> {
    // TODO: Do validation here to make sure invalid budgets are not submitted
    const budget = await this.getBudget(budgetID);

    const newStatus: StatusChange = {
      status: 'submitted',
      when: new Date().toISOString(),
    };
    const updatedStatusHistory = [newStatus];

    // Update the status history
    updatedStatusHistory.push(...budget.status_history);
    budget.status_history = updatedStatusHistory;
    budget.current_status = newStatus.status;

    return this.addBudget(budget);
  }

  /** ITEMS **/
  // getItemsForBudget returns 'howMany' items in budget 'budgetID's'
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

<<<<<<< HEAD
  /** COMMENTS **/
  // Get a comment by ID
  getComment(commentID: string): Promise<Comment> {
    return this.database.getDocument<Comment>(Collections.Comments, commentID);
  }

  // Adds a comment to an item
  // The comment will not be added to the list of previous comments
  // until pushItemComment is called.  If stageItemComment is called
  // twice without a pushItemComment, the first comment will be lost
  // [This function was generated with copilot and then edited]
  async stageItemComment(itemID: string, comment: Comment): Promise<void> {
    await this.database.addDocument(Collections.Comments, comment);
    const item: Item = await this.database.getDocument<Item>(
      Collections.Items,
      itemID
    );
    item.comment = comment.id;
    return await this.database.addDocument(Collections.Items, item);
  }

  // Pushes the staged comment to the item's list of previous comments
  // Clear the current comment.  Once a comment is pushed, it cannot
  // be edited.  RSO comments are intended to be pushed when the budget
  // is resubmitted.  SGA comments are intended to be pushed when the
  // budget review is submitted (i.e. denied)
  async pushItemComment(itemID: string): Promise<void> {
    const item: Item = await this.database.getDocument<Item>(
      Collections.Items,
      itemID
    );
    item.prev_comments.push(item.comment);
    item.comment = '';
    return await this.database.addDocument(Collections.Items, item);
  }

  // Stage a comment for a budget
  // See the comment on stageItemComment for more information
  async stageBudgetComment(budgetID: string, comment: Comment): Promise<void> {
    await this.database.addDocument(Collections.Comments, comment);
    const budget: Budget = await this.database.getDocument<Budget>(
      Collections.Items,
      budgetID
    );
    budget.comment = comment.id;
    return await this.database.addDocument(Collections.Items, budget);
  }

  // Push a comment for a budget
  // [This function was generated with copilot]
  async pushBudgetComment(budgetID: string): Promise<void> {
    const budget: Budget = await this.database.getDocument<Budget>(
      Collections.Items,
      budgetID
    );
    budget.prev_comments.push(budget.comment);
    budget.comment = '';
    return await this.database.addDocument(Collections.Items, budget);
  }

  // Push all comments for a budget including item comments
  async pushAllBudgetComments(budgetID: string): Promise<void> {
    const items = await this.getItemsForBudget(budgetID);
    items.forEach(async item => {
      await this.pushItemComment(item.id);
    });
    return await this.pushBudgetComment(budgetID);
  }

=======
>>>>>>> 8a881a6 (Added comment types and re-organized data_types.ts and data_loader.ts)
  /** USERS **/
  getUser(userID: string): Promise<User> {
    return this.database.getDocument<User>(Collections.Users, userID);
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
}
