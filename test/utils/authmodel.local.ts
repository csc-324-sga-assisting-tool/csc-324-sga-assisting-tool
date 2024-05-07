import {User} from 'lib/data'; // Assuming User interface is defined elsewhere
import {DataModel} from 'lib/data';
import {IAuthModel} from 'lib/data/auth_model';

export class MockAuthModel implements IAuthModel {
  private users: Map<string, string> = new Map(); // Map to store users by email
  private signedInUser: string | null = null;

  async createUser(
    email: string,
    password: string,
    user: User,
    dm: DataModel
  ): Promise<void> {
    // Simulate creating a user in a database
    if (this.users.has(email)) {
      throw new Error('User already exists');
    }
    await dm.setUser(user);
    this.users.set(email, password);
    this.signedInUser = email;
  }

  async signIn(email: string, password: string): Promise<void> {
    // Simulate signing in by checking credentials (in a real scenario, this would interact with a database)
    const userPassword = this.users.get(email);
    if (userPassword && userPassword === password) {
      this.signedInUser = email;
    } else {
      throw new Error('Invalid credentials');
    }
  }

  async signOut(): Promise<void> {
    // Simulate signing out by resetting the signed-in user
    this.signedInUser = null;
  }

  async getSignedInUser(): Promise<string> {
    // Return the signed-in user (if any)
    if (this.signedInUser) {
      return this.signedInUser;
    } else {
      throw new Error('No user signed in');
    }
  }
}
