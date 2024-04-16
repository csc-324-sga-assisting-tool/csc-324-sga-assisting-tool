import {Document, FirestoreDatabase, IDatabase, Sort} from 'lib/data';
import {Firestore, connectFirestoreEmulator} from 'firebase/firestore';

export function getLocalFirebase(db: Firestore): IDatabase {
  const host =
    (db.toJSON() as {settings?: {host?: string}}).settings?.host ?? '';
  if (process.env.APP_ENV === 'local' && !host.startsWith('localhost')) {
    connectFirestoreEmulator(db, 'localhost', 8080);
  }
  return new FirestoreDatabase(db);
}

export async function clearCollection(database: IDatabase, collection: string) {
  const leftOverDocs = await database.getDocuments(
    collection,
    [],
    new Sort('id')
  );

  leftOverDocs.forEach(async (doc: Document) => {
    await database.deleteDocument(collection, doc);
  });
}
