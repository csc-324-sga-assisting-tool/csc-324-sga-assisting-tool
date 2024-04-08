import {OpenGraph} from 'next/dist/lib/metadata/types/opengraph-types';
import {FirestoreDatabase, FirestoreCollection} from './database.firebase';

/*
Database
Represents a Firebase Database.  The name field identifies the database
*/
export interface IDatabase {
  name: string;

  getCollection(collection_name: string): ICollection;
}

/*
Collection
Represents a Firebase Collection of documents keyed by their id
The name field identifies the collection in its parent databse
*/
export interface ICollection {
  name: string;

  getDocument<T extends Document>(id: string): Promise<T>;
  getDocuments<T extends Document>(
    filters: Array<Filter>,
    sort: Sort
  ): Promise<Array<T>>;
  addDocument(doc: Document): Promise<boolean>;
  deleteDocument(doc: Document): Promise<boolean>;
}

/*
Document Type
Represents a Firebase Document (list of key/value pairs)
Every document must have an id.  Oher fields will represent
the other key/value pairs
*/
export type Document = {
  id: string;
};

/*
Filter and Sort types describe how to filter and sort data
from the database
*/
export type FilterOperator = '==' | '<' | '>' | '<=' | '>=';
export type Filter = {
  field: string;
  operator: FilterOperator;
  value: string;
};

export type Sort = {
  field: string;
  isAscending: boolean;
};

// Here's where we decide which implementation of Database the rest of the program uses
// TODO: Expose FirestoreDatabase instead of using a Database alias
export {FirestoreDatabase as Database, FirestoreCollection as Collection};
