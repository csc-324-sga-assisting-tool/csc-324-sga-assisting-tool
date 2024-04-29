import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  Auth,
  deleteUser,
} from 'firebase/auth';
import {User, DataModel, Database} from '.';
import {IAuthModel} from './auth_model';
import {auth, Collections} from 'lib/firebase';

export class FirestoreAuthModel implements IAuthModel {
  // private dm = new DataModel(Database);
  private auth: Auth;
  constructor(authFire: Auth = auth) {
    this.auth = authFire;
  }
  async createUser(
    email: string,
    password: string,
    user: User,
    dm: DataModel = new DataModel(Database)
  ): Promise<void> {
    await setPersistence(this.auth, browserSessionPersistence);
    await createUserWithEmailAndPassword(this.auth, email, password);
    await dm.database.addDocument(Collections.Users, user);
  }

  // add sessions
  async signIn(email: string, password: string): Promise<void> {
    await setPersistence(this.auth, browserSessionPersistence);
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getSignedInUser(): Promise<string> {
    await this.auth.authStateReady();
    const user = this.auth.currentUser;
    if (user && user.email) {
      const email = user.email;
      return email;
    }
    return Promise.reject(new Error('no user signed in'));
    // return Promise.reject('failing');
  }

  async getUser(): Promise<void> {
    await onAuthStateChanged(this.auth, user => {
      if (user !== null) {
        return Promise.resolve();
      } else {
        return Promise.reject('no user1');
      }
    });
  }
}
