import {Document, FirestoreDatabase, IDatabase} from 'lib/data';
import {Firestore, connectFirestoreEmulator} from 'firebase/firestore';
import {connectAuthEmulator, Auth, getAuth} from 'firebase/auth';

export function getLocalFirebase(db: Firestore): IDatabase {
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
