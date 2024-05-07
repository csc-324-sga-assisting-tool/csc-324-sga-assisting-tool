import {
  Item,
  Budget,
  User,
  Comment,
  EventType,
  DataModel,
  UserType,
  Status,
} from '.';
import {forceAlphanumeric, normalizeID} from 'lib/util';

export function userIsSGA(user: User) {
  return (
    user.user_type === 'SGA_Treasurer' ||
    user.user_type === 'SGA_Assistant_Treasurer'
  );
}

export function createComment({
  id,
  userId,
  comment,
}: {
  id?: string;
  userId: string;
  comment?: string;
}): Comment {
  return {
    id: id || `${userId}_${new Date().getSeconds()}`,
    userId,
    comment: comment || 'denied',
  };
}

// Creates a Budget object
// Takes a user_name field
// Synchronous
export function createBudgetSync({
  id,
  user_id,
  user_name,
  event_name,
  event_description,
  event_location,
  event_datetime,
  event_type,
}: {
  id?: string;
  user_id: string;
  user_name: string;
  event_name?: string;
  event_description?: string;
  event_location?: string;
  event_datetime?: string;
  event_type?: EventType;
}): Budget {
  // Create the id by stripping
  const auto_id = forceAlphanumeric(
    normalizeID(`${user_id}-${event_name}-${new Date().getSeconds()}`)
  );
  return {
    id: id || auto_id,
    user_id,
    user_name,
    event_name: event_name || 'Untitled Event',
    event_description: event_description || '',
    event_location: event_location || '',
    event_datetime: event_datetime || '',
    event_type: event_type || 'Other',
    total_cost: 0,
    current_status: 'created',
    status_history: [
      {
        status: 'created',
        when: new Date().toISOString(),
      },
    ],
    denied_items: [],
    prev_commentIDs: [],
    commentID: '',
  };
}

// Creates a Budget object
// Querries database for user_name field
// Asynchronous
export async function createBudget({
  dataModel,
  id,
  user_id,
  event_name,
  event_description,
  event_location,
  event_datetime,
  event_type,
}: {
  dataModel: DataModel;
  id?: string;
  user_id: string;
  event_name?: string;
  event_description?: string;
  event_location?: string;
  event_datetime?: string;
  event_type?: EventType;
}): Promise<Budget> {
  const user_name = (await dataModel.getUser(user_id)).name;
  return createBudgetSync({
    id,
    user_id,
    user_name,
    event_name,
    event_description,
    event_location,
    event_datetime,
    event_type,
  });
}

export function createItem({
  id,
  budget_id,
  name,
  quantity,
  unit_price,
  vendor,
  url,
  commentID,
  prev_commentIDs,
  current_status,
}: {
  id?: string;
  budget_id: string;
  name?: string;
  quantity?: number;
  unit_price?: number;
  vendor?: string;
  url?: string;
  commentID?: string;
  prev_commentIDs?: string[];
  current_status?: Status;
}): Item {
  const auto_id = forceAlphanumeric(
    normalizeID(`${budget_id}-${vendor}-${name}-${new Date().getSeconds()}`)
  );
  return {
    id: id || auto_id,
    budget_id,
    name: name || 'Untitled Item',
    quantity: quantity || 1,
    unit_price: unit_price || 1,
    vendor: vendor || '',
    url: url || '',
    commentID: commentID || '',
    prev_commentIDs: prev_commentIDs || [],
    current_status: current_status || 'created',
  };
}

export function createUser({
  id,
  name,
  remaining_budget,
  total_budget,
  user_type,
  pending_event,
  planned_event,
  completed_event,
}: {
  id: string;
  name: string;
  remaining_budget?: number;
  total_budget?: number;
  user_type: UserType;
  pending_event?: number;
  planned_event?: number;
  completed_event?: number;
}): User {
  return {
    id,
    name,
    remaining_budget: remaining_budget || 0,
    total_budget: total_budget || 0,
    user_type,
    pending_event: pending_event || 0,
    planned_event: planned_event || 0,
    completed_event: completed_event || 0,
  };
}
