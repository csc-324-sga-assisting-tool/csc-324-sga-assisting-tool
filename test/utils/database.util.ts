import {Document, FirestoreDatabase, IDatabase} from 'lib/data';
import {
  Firestore,
  connectFirestoreEmulator,
  getFirestore,
} from 'firebase/firestore';
import {connectAuthEmulator, getAuth} from 'firebase/auth';

export function getLocalFirebase(db: Firestore = getFirestore()): IDatabase {
  connectFirestoreEmulator(db, 'localhost', 3240);
  return new FirestoreDatabase(db);
}

export function getLocalAuth() {
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
