import {OpenGraph} from 'next/dist/lib/metadata/types/opengraph-types';

/*
Document Type
Represents a Firebase Document (list of key/value pairs)
Every document must have an id.  Oher fields will represent
the other key/value pairs
*/
interface Document {
  id: string;
}

type FilterOperator = '==' | '<' | '>' | '<=' | '>=';
interface Filter {
  field: string;
  operator: FilterOperator;
  value: string;
}

interface Sort {
  field: string;
  isAscending: boolean;
}

/*
Collection
Represents a Firebase Collection of documents keyed by their id
*/
class Collection {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  getDocument(id: string): Document {
    return {id: 'id'};
  }
  getDocuments(filters: Array<Filter>, sort: Sort): Array<Document> {
    return [{id: 'id'}];
  }
  addDocument(doc: Document): boolean {
    return true;
  }
  deleteDocument(doc: Document): boolean {
    return true;
  }
}

class Database {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  getCollection(name: string): Collection {
    return new Collection(name);
  }
}
