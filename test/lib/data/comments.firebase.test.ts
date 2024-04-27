import {assert, beforeEach, it, describe, expect} from 'vitest';
import {getFirestore} from 'firebase/firestore';
import {Comment, Budget, DataModel, User} from 'lib/data';
import {Collections} from 'lib/firebase';
import {getLocalFirebase, clearCollection} from '../../utils/database.util';

const db = getFirestore();
const database = getLocalFirebase(db);
const dataModel = new DataModel(database);

async function initializeUsers(): Promise<void> {
  const sgaUser: User = {
    id: 'sga_user',
    name: 'SGA Treasurer',
    remaining_budget: 0,
    total_budget: 0,
    user_type: 'SGA_Treasurer',
    pending_event: 0,
    planned_event: 0,
    completed_event: 0,
  };

  const rsoUser: User = {
    id: 'rso_user',
    name: 'RSO',
    remaining_budget: 1000,
    total_budget: 1000,
    user_type: 'RSO',
    pending_event: 0,
    planned_event: 0,
    completed_event: 0,
  };

  await database.addDocument(Collections.Users, sgaUser);
  await database.addDocument(Collections.Users, rsoUser);
}

async function initializeBudget(id: string): Promise<void> {
  const budget: Budget = {
    id: id,
    user_id: 'rso_user',
    user_name: 'RSO',
    event_name: id,
    event_description: 'test description',
    event_type: 'Harris',
    total_cost: 100,
    current_status: 'created',
    status_history: [],
    prev_comments: [],
    comment: '',
    denied_items: [],
  };
  await dataModel.addBudget(budget);
}

async function initializeItems(budgetID: string): Promise<void> {
  const items = [0, 1, 2, 3].map(i => {
    return {
      id: `item_${i}`,
      budget_id: budgetID,
      name: `item_${i}`,
      quantity: i,
      unit_price: 10 - i,
      vendor: undefined,
      prev_comments: [],
      comment: '',
    };
  });

  await dataModel.addItems(items);
}

beforeEach(async () => {
  // Clear the database
  await clearCollection(database, Collections.Users);
  await clearCollection(database, Collections.Budgets);
  await clearCollection(database, Collections.Items);
  await clearCollection(database, Collections.Comments);

  // Repopulate the database with users, budgets, and items
  await initializeUsers();
  await initializeBudget('budget_1');
  await initializeBudget('budget_2');
  await initializeItems('budget_1');
  await initializeItems('budget_2');
});

describe('Test comments', async () => {
  const sga_comment: Comment = {
    id: 'comment_1',
    comment: 'Item is is too expensive',
    userId: 'sga_user',
  };

  it('getComment works', async () => {
    await database.addDocument(Collections.Comments, sga_comment);
    const retrievedComment = await dataModel.getComment(sga_comment.id);
    expect(retrievedComment).toEqual(sga_comment);
  });

  //it('stagedItemComment works', async () => {
  //await dataModel.stageItemComment('item_1', sga_comment);

  //const item = await dataModel.getItem('item_1');
  //const budget = await dataModel.getBudget(item.budget_id);

  //expect(item.comment).toEqual(sga_comment.comment);
  //expect(item.prev_comments).toEqual([]);
  //expect(budget.denied_items).toEqual([item.id]);
  //});
});
