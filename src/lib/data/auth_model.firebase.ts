import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  Auth,
} from 'firebase/auth';
import {User, DataModel, Database} from '.';
import {IAuthModel} from './auth_model';
import {auth, Collections} from 'lib/firebase';
import {cookies} from 'next/headers';
import {decodeProtectedHeader, importX509, jwtVerify} from 'jose';

const AUTH_COOKIE_FIREBASE = 'AUTH_COOKIE_FIREBASE';
const USER_ID_FIREBASE = 'USER_ID_FIREBASE';
const USER_EMAIL_FIREBASE = 'USER_EMAIL_FIREBASE';

// Constants used to verify cookies
const GOOGLE_PUBLIC_KEY =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
const PROJECT_ID = 'gbudget-324';
const KEY_ISSUER = `https://securetoken.google.com/${PROJECT_ID}`;

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
    await setPersistence(this.auth, browserLocalPersistence);
    const res = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    await dm.database.addDocument(Collections.Users, user);
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
      return await this.verifyCookie(session.value, user.value);
    }
    return Promise.reject(new Error('no user signed in'));
  }
  // verifyCookie checks that an auth cookie is valid and not expired
  // https://firebase.google.com/docs/auth/admin/verify-id-tokens#verify_id_tokens_using_a_third-party_jwt_library
  private async verifyCookie(session?: string, uid?: string): Promise<string> {
    if (!session || !uid) {
      return Promise.reject(new Error('no session cookie available'));
    }
    const keys = await fetchPublicKey(GOOGLE_PUBLIC_KEY);
    try {
      const header = decodeProtectedHeader(session);
      const keyString = keys[header.kid!];
      const key = await importX509(keyString, 'RS256');
      const {payload} = await jwtVerify(session, key);
      const now = Date.now() / 1000;
      if (payload.exp! <= now) {
        return Promise.reject(new Error('session cookie has expired'));
      }
      if (payload.aud !== PROJECT_ID) {
        return Promise.reject(
          new Error('session cookie contains invalid project id')
        );
      }
      if (payload.iat! > now) {
        return Promise.reject(
          new Error('session cookie was issued in the future')
        );
      }
      if (payload.iss! !== KEY_ISSUER) {
        return Promise.reject(
          new Error('session cookie contains invalid issuer')
        );
      }
      if (payload.sub !== uid) {
        return Promise.reject(
          new Error('session cookie contains invalid user information')
        );
      }
      return payload.email as string;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

// fetchPublicKey is a helper method intended to fetch google's public signing keys
// to verify that firebase cookie was singed by googled
//AI Acknowledgement: This function was written using ChatGPT
async function fetchPublicKey(
  address: string
): Promise<{[key: string]: string}> {
  const res = await fetch(address);
  return await res.json();
}
