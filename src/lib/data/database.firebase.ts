import {Database, Collection, Document, Sort, Filter} from './database';
import {Collections, db} from '../firebase/config';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

class FirestoreDatabase implements Database {
  name: string;
  private firestore: Firestore;
  constructor(databaseName: string, firestore: Firestore = db) {
    this.name = databaseName;
    this.firestore = firestore;
  }

  getCollection(collectionName: string): Collection {
    return new FirestoreCollection(collectionName, this, this.firestore);
  }
}

class FirestoreCollection implements Collection {
  name: string;
  private database: FirestoreDatabase;
  private fbCollection;
  constructor(
    collectionName: string,
    database: FirestoreDatabase,
    firestore: Firestore = db
  ) {
    this.name = collectionName;
    this.database = database;
    this.fbCollection = collection(firestore, collectionName);
  }

  getDocument(id: string): Document {
    const result = await getDoc(doc(db, this.name, id));
    return result.data() as Document;
  }
  getDocuments(filters: Filter[], sort: Sort, howMany = 25): Document[] {
    // Create a firebase query
    let q = query(this.fbCollection, limit(howMany));

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
    const documents: Document[] = [];
    result.forEach(doc => {
      const data = doc.data() as Document;
      documents.push(data);
    });

    return documents;
  }
  addDocument(doc: Document): boolean {
    throw new Error('Method not implemented.');
  }
  deleteDocument(doc: Document): boolean {
    throw new Error('Method not implemented.');
  }
}
