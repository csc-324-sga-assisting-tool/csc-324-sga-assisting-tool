import {IDatabase, Sort, Filter} from './database';
import {Document} from './data_types';
import {
  and,
  doc,
  collection as getCollection,
  Firestore,
  getDoc,
  getDocs,
  deleteDoc,
  setDoc,
  limit,
  orderBy,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import {Collections, db} from 'lib/firebase';

export class FirestoreDatabase implements IDatabase {
  private firestore: Firestore;
  constructor(firestore: Firestore = db) {
    this.firestore = firestore;
  }

  async getDocument<T extends Document>(
    collection: Collections,
    id: string
  ): Promise<T> {
    const result = await getDoc(doc(this.firestore, collection, id));
    if (result.exists()) {
      return result.data() as T;
    } else
      return Promise.reject(
        new Error(
          `Document with id ${id} does not exist in collection ${collection}`
        )
      );
  }
  async getDocuments<T extends Document>(
    collection: Collections,
    filters: Filter[],
    sort?: Sort,
    howMany = 25
  ): Promise<T[]> {
    // Sort the query
    let sortField = undefined;
    if (sort && sort.isAscending) {
      sortField = orderBy(sort.field);
    } else if (sort) {
      sortField = orderBy(sort.field, 'desc');
    }
    // Generate the filter for the query
    const wheres = filters.map((filter: Filter) => {
      return where(filter.field, filter.operator, filter.value);
    });

    // Create a firebase query
    const coll = getCollection(this.firestore, collection);
    let q = query(coll, limit(howMany));
    // if both sorting and filtering
    if (wheres.length > 0 && sortField) {
      q = query(coll, and(...wheres), sortField, limit(howMany));
    } else if (wheres.length > 0) {
      q = query(coll, and(...wheres), limit(howMany));
    } else if (sortField) {
      q = query(coll, sortField, limit(howMany));
    }
    // Get all matching documents
    const result = await getDocs(q);

    // Collect the data from those documents in an array
    const documents: T[] = [];
    result.forEach(doc => {
      const data = doc.data() as T;
      documents.push(data);
    });

    return documents;
  }

  // Adds the given document with an id
  // If a document with the same id already exists in the collection, it is overwritten
  async addDocument(collection: Collections, newDoc: Document): Promise<void> {
    // Add the document to firebase
    return setDoc(doc(this.firestore, collection, newDoc.id), newDoc);
  }

  // Add many documents to firebase using a batched write
  // More performant when writing many documents to the same collection
  async addManyDocuments(
    collection: Collections,
    newDocs: Document[]
  ): Promise<void> {
    const batch = writeBatch(db);
    newDocs.forEach(newDoc => {
      batch.set(doc(this.firestore, collection, newDoc.id), newDoc);
    });
    return batch.commit();
  }

  async deleteDocument(
    collection: Collections,
    delete_doc: Document
  ): Promise<void> {
    // Delete the firebase document
    const document = doc(this.firestore, collection, delete_doc.id);
    return await deleteDoc(document);
  }
}
