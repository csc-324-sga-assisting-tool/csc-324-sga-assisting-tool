import {Document} from './database';
// utility types to reduce redudancy
interface Comments {
  rso_comment?: string;
  sga_treasurer_comment?: string;
}
// an Item will represent a single item in a budget
interface Item extends Comments {
  item_id: string;
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

// Budget represents a single budget request
// some fields are allowed to be undefined so users can work on budgets without knowing all the details
interface Budget extends Comments, Document {
  id: string; // the budget id (from Document type)
  user_id: string; // the user this budget belongs to
  event_name: string;
  event_description: string;
  event_datetime?: string;
  event_location?: string;
  event_type?: string; // shouldn't be string but restricted to a specific string like 'food', cultural'... once we know types
  total_cost: number;
  current_status: Status;
  status_history: [StatusChange] | [];
  items: [Item] | [];
}

export type {Budget, Item, Status, StatusChange};
