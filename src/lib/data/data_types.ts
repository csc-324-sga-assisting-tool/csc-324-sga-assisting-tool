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

// A comment is a message left by a user on a budget or item
interface Comment extends Document {
  comment: string;
  userId: string;
}

interface Commentable {
  prev_commentIDs: string[]; // List of IDs of previous comments
  commentID: string; // ID of latest comment.  Added to prev_comments when review/budget is (re)submitted
}

// an Item will represent a single item in a budget
interface Item extends Commentable, Document {
  budget_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  vendor: string;
  url?: string;
}

// Budget represents a single budget request
// some fields are allowed to be undefined so users can work on budgets without knowing all the details
interface Budget extends Commentable, Document {
  user_id: string; // the user this budget belongs to
  user_name: string; // the name of the user this budget belongs to
  event_name: string;
  event_description: string;
  event_datetime?: string;
  event_location?: string;
  event_type: EventType; // shouldn't be string but restricted to a specific string like 'food', cultural'... once we know types
  total_cost: number;
  current_status: Status;
  status_history: StatusChange[];
  // List of IDs of items that were denied
  // This is so we can disable "Approve Budget" if items have
  // comments, and implement "Delete All Comments" without
  // having to sort for all items with comments
  denied_items: string[];
}

// User represents a single user
//user.id is email of user
interface User extends Document {
  id: string;
  name: string;
  remaining_budget: number;
  total_budget: number;
  user_type: UserType;
  pending_event: number;
  planned_event: number;
  completed_event: number;
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

const UserTypes = [
  'RSO',
  'SEPC',
  'SGA_Treasurer',
  'SGA_Assistant_Treasurer',
] as const;
type UserType = (typeof UserTypes)[number];

export type {
  Comment,
  Budget,
  Document,
  EventType,
  UserType,
  Item,
  Status,
  StatusChange,
  User,
};
export {EventTypes, UserTypes};
