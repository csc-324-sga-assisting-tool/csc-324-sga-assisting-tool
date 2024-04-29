import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
} from 'firebase/auth';
import {User, DataModel, Database} from '.';
import {IAuthModel} from './auth_model';
import {Collections} from 'lib/firebase';

export class FirestoreAuthModel implements IAuthModel {
  // private dm = new DataModel(Database);
  private auth = getAuth();

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
    // onAuthStateChanged(this.auth, user => {
    //   if (user !== null) {
    //     return user.email!;
    //   } else {
    //     return Promise.reject('no user');
    //   }
    // });
    await this.auth.authStateReady();
    const user = this.auth.currentUser;
    if (user !== null) {
      const email = user.email;
      if (email !== null) {
        return email;
      }
      return Promise.reject('no email');
    }
    return Promise.reject('no user signed in');
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
