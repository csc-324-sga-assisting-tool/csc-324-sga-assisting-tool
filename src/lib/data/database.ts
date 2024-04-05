import {OpenGraph} from 'next/dist/lib/metadata/types/opengraph-types';

/*
Database
Represents a Firebase Database.  The name field identifies the database
*/
interface Database {
  name: string;

  getCollection(collection_name: string): Collection;
}

/*
Collection
Represents a Firebase Collection of documents keyed by their id
The name field identifies the collection in its parent databse
*/
interface Collection {
  name: string;

  getDocument(id: string): Document;
  getDocuments(filters: Array<Filter>, sort: Sort): Array<Document>;
  addDocument(doc: Document): boolean;
  deleteDocument(doc: Document): boolean;
}

/*
Document Type
Represents a Firebase Document (list of key/value pairs)
Every document must have an id.  Oher fields will represent
the other key/value pairs
*/
interface Document {
  id: string;
}

/*
Filter and Sort types describe how to filter and sort data
from the database
*/
type FilterOperator = '==' | '<' | '>' | '<=' | '>=';
type Filter = {
  field: string;
  operator: FilterOperator;
  value: string;
};

type Sort = {
  field: string;
  isAscending: boolean;
};

export type {Document, FilterOperator, Filter, Sort, Collection, Database};
