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
  const rso_user = await dataModel.getUser('rso_user');
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
    prev_commentIDs: [],
    commentID: '',
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
      vendor: '',
      prev_commentIDs: [],
      commentID: '',
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
  //await initializeItems('budget_2');
});

describe('Test item comments', async () => {
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

  it('stagedItemComment works', async () => {
    await dataModel.stageItemComment('item_1', sga_comment);

    const item = await dataModel.getItem('item_1');
    const item_comment = await dataModel.getComment(item.commentID);
    const budget = await dataModel.getBudget(item.budget_id);

    expect(item_comment.comment).toEqual(sga_comment.comment);
    expect(item.prev_commentIDs).toEqual([]);
    expect(budget.denied_items).toEqual([item.id]);
  });

  it('popItemComment works', async () => {
    await dataModel.stageItemComment('item_1', sga_comment);
    await dataModel.popItemComment('item_1');

    const item = await dataModel.getItem('item_1');
    const budget = await dataModel.getBudget(item.budget_id);

    expect(item.commentID).toEqual('');
    expect(item.prev_commentIDs).toEqual([]);
    expect(budget.denied_items).toEqual([]);
  });

  it('pushItemComment works', async () => {
    await dataModel.stageItemComment('item_1', sga_comment);
    await dataModel.pushItemComment('item_1');

    const item = await dataModel.getItem('item_1');
    const budget = await dataModel.getBudget(item.budget_id);

    expect(item.commentID).toEqual('');
    expect(item.prev_commentIDs).toEqual([sga_comment.id]);
    expect(budget.denied_items).toEqual([]);

    const comment = await dataModel.getComment(item.prev_commentIDs[0]);
    expect(comment.comment).toEqual(sga_comment.comment);
  });

  it('popItemComment does nothing after a push', async () => {
    await dataModel.stageItemComment('item_1', sga_comment);
    await dataModel.pushItemComment('item_1');
    await dataModel.popItemComment('item_1');

    const item = await dataModel.getItem('item_1');
    const budget = await dataModel.getBudget(item.budget_id);

    expect(item.commentID).toEqual('');
    expect(item.prev_commentIDs).toEqual([sga_comment.id]);
    expect(budget.denied_items).toEqual([]);
  });
});

describe('Test budget comments', async () => {
  const sga_comment: Comment = {
    id: 'comment_1',
    comment: 'Budget is is too expensive',
    userId: 'sga_user',
  };

  it('stagedBudgetComment works', async () => {
    await dataModel.stageBudgetComment('budget_1', sga_comment);

    const budget = await dataModel.getBudget('budget_1');
    const budget_comment = await dataModel.getComment(budget.commentID);

    expect(budget_comment.comment).toEqual(sga_comment.comment);
    expect(budget.prev_commentIDs).toEqual([]);
    expect(budget.denied_items).toEqual([]);
  });

  it('popBudgetComment works', async () => {
    await dataModel.stageBudgetComment('budget_1', sga_comment);
    await dataModel.popBudgetComment('budget_1');

    const budget = await dataModel.getBudget('budget_1');

    expect(budget.commentID).toEqual('');
    expect(budget.prev_commentIDs).toEqual([]);
  });

  it('pushBudgetComment works', async () => {
    await dataModel.stageBudgetComment('budget_1', sga_comment);
    await dataModel.pushBudgetComment('budget_1');

    const budget = await dataModel.getBudget('budget_1');

    expect(budget.commentID).toEqual('');
    expect(budget.prev_commentIDs).toEqual([sga_comment.id]);
  });

  it('popBudgetComment does nothing after push', async () => {
    await dataModel.stageBudgetComment('budget_1', sga_comment);
    await dataModel.pushBudgetComment('budget_1');
    await dataModel.popBudgetComment('budget_1');

    const budget = await dataModel.getBudget('budget_1');

    expect(budget.commentID).toEqual('');
    expect(budget.prev_commentIDs).toEqual([sga_comment.id]);
  });
});
