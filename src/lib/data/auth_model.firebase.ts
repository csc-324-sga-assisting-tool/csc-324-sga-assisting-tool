import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  Auth,
} from 'firebase/auth';
import {User, DataModel} from '.';
import {IAuthModel} from './auth_model';
import {auth} from 'lib/firebase';
import {cookies} from 'next/headers';
import {verifyCookie} from 'lib/firebase/cookies';

const AUTH_COOKIE_FIREBASE = 'AUTH_COOKIE_FIREBASE';
const USER_ID_FIREBASE = 'USER_ID_FIREBASE';
const USER_EMAIL_FIREBASE = 'USER_EMAIL_FIREBASE';

export class FirestoreAuthModel implements IAuthModel {
  private auth: Auth;
  constructor(authFire: Auth = auth) {
    this.auth = authFire;
  }
  async createUser(
    email: string,
    password: string,
    user: User,
    dm: DataModel
  ): Promise<void> {
    await setPersistence(this.auth, browserLocalPersistence);
    const res = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    await dm.setUser(user);
    const idToken = await res.user.getIdToken(true);
    cookies().set(AUTH_COOKIE_FIREBASE, idToken);
    cookies().set(USER_ID_FIREBASE, res.user.uid!);
    cookies().set(USER_EMAIL_FIREBASE, res.user.email!);
  }

  // add sessions
  async signIn(email: string, password: string): Promise<void> {
    await setPersistence(this.auth, browserLocalPersistence);
    const res = await signInWithEmailAndPassword(this.auth, email, password);
    const idToken = await res.user.getIdToken(true);
    cookies().set(AUTH_COOKIE_FIREBASE, idToken);
    cookies().set(USER_ID_FIREBASE, res.user.uid!);
  }

  async signOut(): Promise<void> {
    cookies().delete(AUTH_COOKIE_FIREBASE);
    cookies().delete(USER_ID_FIREBASE);
    try {
      await signOut(this.auth);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getSignedInUser(): Promise<string> {
    const session = cookies().get(AUTH_COOKIE_FIREBASE);
    const user = cookies().get(USER_ID_FIREBASE);
    // If cookies are unset or the verification fails, return an error
    if (session && user) {
      return await verifyCookie(session.value, user.value);
    }
    return Promise.reject(new Error('no user signed in'));
  }
}
