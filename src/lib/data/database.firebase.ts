import {IDatabase, Sort, Filter} from './database';
import {Document} from './data_types';
import {
  collection as getCollection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  deleteDoc,
  addDoc,
  setDoc,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import {db} from 'lib/firebase';

export class FirestoreDatabase implements IDatabase {
  private firestore: Firestore;
  constructor(firestore: Firestore = db) {
    this.firestore = firestore;
  }

  async getDocument<T extends Document>(
    collection: string,
    id: string
  ): Promise<T> {
    const result = await getDoc(doc(this.firestore, collection, id));
    if (result.exists()) return {...result.data(), id: result.id} as T;
    else
      return Promise.reject(
        new Error(
          `Document with id ${id} does not exist in collection ${collection}`
        )
      );
  }
  async getDocuments<T extends Document>(
    collection: string,
    filters: Filter[],
    sort: Sort,
    howMany = 25
  ): Promise<T[]> {
    // Create a firebase query
    const coll = getCollection(this.firestore, collection);
    let q = query(coll, limit(howMany));

    // Sort the query
    if (sort.isAscending) q = query(q, orderBy(sort.field));
    else q = query(q, orderBy(sort.field, 'desc'));

    // Filter the query
    filters.forEach((filter: Filter) => {
      q = query(q, where(filter.field, filter.operator, filter.value));
    });

    // Get all matching documents
    const result = await getDocs(q);

    // Collect the data from those documents in an array
    const documents: T[] = [];
    result.forEach(doc => {
      const data = {...doc.data(), id: doc.id} as T;
      documents.push(data);
    });

    return documents;
  }

  // Adds the given document with an id
  // If a document with the same id already exists in the collection, it is overwritten
  async addDocument(collection: string, new_doc: Document): Promise<boolean> {
    // Add the document to firebase
    const {id, ...docData} = new_doc;
    await setDoc(doc(this.firestore, collection, id), docData);
    return true;
  }

  // Adds the given document without reference to an id
  // Returns the id assigned to the document
  // Note: if the given document contains an "id" field, it will be treated
  // as data and not as the id of the document
  async addDocumentWithAutoID(
    collection: string,
    new_doc: object
  ): Promise<string> {
    const docRef = await addDoc(
      getCollection(this.firestore, collection),
      new_doc
    );
    return docRef.id;
  }
  async deleteDocument(
    collection: string,
    delete_doc: Document
  ): Promise<boolean> {
    // Delete the firebase document
    const document = doc(this.firestore, collection, delete_doc.id);
    await deleteDoc(document);
    return true;
  }
}
