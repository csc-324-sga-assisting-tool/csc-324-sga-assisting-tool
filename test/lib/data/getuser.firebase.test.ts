import {assert, beforeAll, it, describe} from 'vitest';
import {
  connectFirestoreEmulator,
  getFirestore,
  doc,
  writeBatch,
} from 'firebase/firestore';
import {User, getUser} from 'lib/data';
import {Collection} from 'lib/firebase';

const db = getFirestore();

beforeAll(async () => {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  const testUser: User[] = [1, 2, 3].map(() => {
    return {
      user_id: 'test_user1',
      total_budget: 2000,
      remaining_budget: 1000,
      pending_event: 5,
      completed_event: 10,
      planned_event: 5,
      is_SEPC: false,
      user_name: 'test_user1',
      user_type: 'test_type1',
    };
  });

  testUser.push({
    user_id: 'test_user2',
    total_budget: 1000,
    remaining_budget: 200,
    pending_event: 5,
    completed_event: 5,
    planned_event: 5,
    is_SEPC: false,
    user_name: 'test_user2',
    user_type: 'test_user2',
  });

  const batch = writeBatch(db);

  testUser.map(async user => {
    batch.set(doc(db, Collection.Budgets, user.user_id), user);
  });

  await batch.commit();
});

describe('test firebase getUser', () => {
  // dummy budgets for testing the getBudget function
  it('wrapper function gets correct user', async () => {
    const user = await getUser('test_user1', db);
    assert.equal(user!.user_id, 'test_user1');
  });

  it('wrapper function gets correct user', async () => {
    const user = await getUser('bad_id', db);
    assert(user!.user_id === undefined);
  });

  it('wrapper function gets correct total budget', async () => {
    const user = await getUser('test_user1', db);
    assert.equal(user!.total_budget, 2000);
  });

  it('wrapper function gets correct remaining budget', async () => {
    const user = await getUser('test_user1', db);
    assert.equal(user!.remaining_budget, 1000);
  });

  it('wrapper function gets correct pending event', async () => {
    const user = await getUser('test_user1', db);
    assert.equal(user!.pending_event, 5);
  });

  it('wrapper function gets correct completed event', async () => {
    const user = await getUser('test_user1', db);
    assert.equal(user!.completed_event, 10);
  });

  it('wrapper function gets correct planned event', async () => {
    const user = await getUser('test_user1', db);
    assert.equal(user!.planned_event, 5);
  });
});
