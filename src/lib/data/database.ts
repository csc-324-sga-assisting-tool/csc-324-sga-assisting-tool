/*
Database
Represents a Firebase Database.  The name field identifies the database
*/
export interface IDatabase {
  name: string;

  getDocument<T extends Document>(collection: string, id: string): Promise<T>;
  getDocuments<T extends Document>(
    collection: string,
    filters: Array<Filter>,
    sort: Sort
  ): Promise<Array<T>>;
  addDocument(collection: string, doc: Document): Promise<boolean>;
  deleteDocument(collection: string, doc: Document): Promise<boolean>;
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
  constructor(field: string, operator: FilterOperator, value) {
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
