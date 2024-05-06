import {vi} from 'vitest';
import {Document, FirestoreDatabase, IDatabase} from 'lib/data';
import {
  Firestore,
  connectFirestoreEmulator,
  getFirestore,
} from 'firebase/firestore';
import {connectAuthEmulator, getAuth} from 'firebase/auth';
import {decodeCookie} from 'lib/firebase/cookies';

export function getLocalFirebase(db: Firestore = getFirestore()): IDatabase {
  connectFirestoreEmulator(db, 'localhost', 3240);
  return new FirestoreDatabase(db);
}

export function getLocalAuth() {
  // Mock cookie verification so no network calls are made
  vi.mock('lib/firebase/cookies', async importOriginal => {
    const mod = await importOriginal<typeof import('lib/firebase/cookies')>();
    return {
      ...mod,
      // replace some exports
      verifyCookie: (session?: string, uid?: string) => decodeCookie(session),
    };
  });

  // Mock cookies api so cookies can be used when testing auth
  vi.mock('next/headers', async () => {
    const cookiesMap: Record<string, string> = {};
    return {
      cookies: () => {
        return {
          get: (name: string) => {
            return {
              value: cookiesMap[name] || '',
            };
          },
          set: (name: string, value: string) => {
            cookiesMap[name] = value;
          },
          delete: (name: string) => {
            delete cookiesMap[name];
          },
        };
      },
    };
  });
  const auth = getAuth();
  connectAuthEmulator(auth, 'http://localhost:9099');
  return auth;
}

export async function clearCollection(database: IDatabase, collection: string) {
  const docs = await database.getDocuments(collection, []);

  docs.forEach(async (doc: Document) => {
    await database.deleteDocument(collection, doc);
  });
}

export async function clearAuthUsers(projectID = 'demo', port = 9099) {
  const url = `http://localhost:${port}/emulator/v1/projects/${projectID}/accounts`;
  const options = {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer owner',
    },
  };
  const res = await fetch(url, options);
  if (!res.ok)
    return Promise.reject(
      new Error(`couldn't clear users; got response \n ${await res.json()}`)
    );
}
