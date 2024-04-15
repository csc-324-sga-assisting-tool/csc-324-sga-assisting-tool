import {Budget, User, DataProvider, DataModifier} from 'lib/data';

export class MockDataStore implements DataProvider, DataModifier {
  budgets: Budget[] = [];
  users: User[] = [];

  async getBudget(budgetID: string): Promise<Budget | undefined> {
    return Promise.resolve(
      this.budgets.find(budget => budget.budget_id === budgetID)
    );
  }

  async getUserBudgets(userID: string): Promise<Budget[]> {
    return Promise.resolve(
      this.budgets.filter(budget => budget.user_id === userID)
    );
  }

  async getUser(userID: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find(user => user.user_id === userID));
  }

  async addBudget(budget: Budget): Promise<void> {
    this.budgets.push(budget);
    return Promise.resolve();
  }

  // Additional method to add a user
  async addUser(user: User): Promise<void> {
    this.users.push(user);
    return Promise.resolve();
  }

  // Helper method to set initial budgets and users (for testing)
  setBudgets(budgets: Budget[]): void {
    this.budgets = budgets;
  }

  setUsers(users: User[]): void {
    this.users = users;
  }
}
