// utility types to reduce redudancy
interface Comments {
  rso_comment?: string;
  sga_treasurer_comment?: string;
}
// an Item will represent a single item in a budget
interface Item extends Comments, Document {
  budget_id: string;
  name: string;
  quantity: number;
  cost: number;
  vendor: string | undefined;
  url: string;
}

// Status represents the different status a budget can be in
type Status = 'approved' | 'denied' | 'submitted' | 'created';

// StatusChange represents a change in the budget status (i.e. creation, submission, approval, etc.,)
type StatusChange = {
  status: Status;
  when: string;
};

//stackoverflow.com/questions/40863488/how-can-i-iterate-over-a-custom-literal-type-in-typescript
const EventTypes = ['Harris', 'Gardner', 'Cultural', 'Food', 'Other'] as const;
type EventType = (typeof EventTypes)[number];

/*
Document Type
Represents a Firebase Document (list of key/value pairs)
Every document must have an id.  Oher fields will represent
the other key/value pairs
*/
type Document = {
  id: string;
  // Allow us to access attributes of the document by string indexing
  // Used in the local database for testing
  [key: string]: unknown;
};

// Budget represents a single budget request
// some fields are allowed to be undefined so users can work on budgets without knowing all the details
interface Budget extends Comments, Document {
  user_id: string; // the user this budget belongs to
  event_name: string;
  event_description: string;
  event_datetime?: string;
  event_location?: string;
  event_type?: EventType; // shouldn't be string but restricted to a specific string like 'food', cultural'... once we know types
  total_cost: number;
  current_status: Status;
  status_history: [StatusChange] | [];
  items: [Item] | [];
}

type UserType = 'RSO' | 'SEPC' | 'SGA_Treasurer' | 'SGA_Assistant_Treasurer';
// User represents a single user
interface User extends Document {
  user_name: string;
  remaining_budget: number;
  total_budget: number;
  user_type: UserType;
  pending_event: number;
  planned_event: number;
  completed_event: number;
}

export type {Budget, Document, EventType, Item, Status, StatusChange, User};
export {EventTypes};
