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
  const testUser: User[] = [1, 2, 3].map(number => {
    return {
      user_id: `test_user${number}`,
      total_budget: 2000,
      remaining_budget: 1000,
      pending_event: 5,
      completed_event: 10,
      planned_event: 5,
      user_name: 'test_user1',
      user_type: 'RSO',
    };
  });

  testUser.push({
    user_id: 'test_user4',
    total_budget: 1000,
    remaining_budget: 200,
    pending_event: 5,
    completed_event: 5,
    planned_event: 5,
    user_name: 'test_user2',
    user_type: 'SEPC',
  });

  const batch = writeBatch(db);

  testUser.map(async user => {
    batch.set(doc(db, Collection.Users, user.user_id), user);
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
    assert(user === undefined);
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
