import {db} from 'lib/firebase';
import {FirestoreDatabase} from './database.firebase';
import {Document} from '.';
/*
Database
Represents a Firebase Database.  The name field identifies the database
*/
export interface IDatabase {
  // TODO: Should this return undefined if the document doesn't exist? Or throw an error?
  getDocument<T extends Document>(collection: string, id: string): Promise<T>;
  getDocuments<T extends Document>(
    collection: string,
    filters: Array<Filter>,
    sort?: Sort,
    howMany?: number
  ): Promise<Array<T>>;
  addDocument(collection: string, doc: Document): Promise<void>;
  addDocuments(collection: string, docs: Document[]): Promise<void>;
  deleteDocument(collection: string, doc: Document): Promise<void>;
}

/*
Filter and Sort types describe how to filter and sort data
from the database

Examples:

* A filter to check if a document's `name` field is equal
to "Pet Lover's United":
 - { field: "name", operator: "==", value: "Pet Lover's United" }
*/
export type FilterOperator = '==' | '<' | '>' | '<=' | '>=';
export class Filter {
  field: string;
  operator: FilterOperator;
  value;
  constructor(field: string, operator: FilterOperator, value: string | number) {
    this.field = field;
    this.operator = operator;
    this.value = value;
  }
}

export class Sort {
  field: string;
  isAscending: boolean;
  constructor(field: string, isAscending = true) {
    this.field = field;
    this.isAscending = isAscending;
  }
}

// The default database used throughout the project
export const Database = new FirestoreDatabase(db);
