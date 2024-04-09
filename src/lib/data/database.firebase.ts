import {IDatabase, Document, Sort, Filter} from './database';
import {
  collection as getCollection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

export class FirestoreDatabase implements IDatabase {
  name: string;
  private firestore: Firestore;
  constructor(databaseName: string, firestore: Firestore = db) {
    this.name = databaseName;
    this.firestore = firestore;
  }

  async getDocument<T extends Document>(
    collection: string,
    id: string
  ): Promise<T> {
    const result = await getDoc(doc(this.firestore, collection, id));
    return result.data() as T;
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
      const data = doc.data() as T;
      documents.push(data);
    });

    return documents;
  }
  addDocument(collection: string, doc: Document): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  deleteDocument(collection: string, doc: Document): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
