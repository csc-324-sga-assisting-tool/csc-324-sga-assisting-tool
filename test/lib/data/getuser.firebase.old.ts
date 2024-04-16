import {assert, beforeAll, it, describe, expect} from 'vitest';
import {getFirestore} from 'firebase/firestore';
import {DataProvider, User} from 'lib/data';
import {Collections} from 'lib/firebase';
import {getLocalFirebase} from '../../utils/database.util';

const db = getFirestore();
const database = getLocalFirebase(db);

beforeAll(async () => {
  const testUser: User[] = [1, 2, 3].map(number => {
    return {
      id: `test_user${number}`,
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
    id: 'test_user4',
    total_budget: 1000,
    remaining_budget: 200,
    pending_event: 5,
    completed_event: 5,
    planned_event: 5,
    user_name: 'test_user2',
    user_type: 'SEPC',
  });

  testUser.forEach(document =>
    database.addDocument(Collections.Users, document)
  );
});

describe('test firebase getUser', () => {
  const dataProvider = new DataProvider(database);
  it('wrapper function gets correct user', async () => {
    const user = await dataProvider.getUser('test_user1');
    assert.equal(user!.id, 'test_user1');
  });

  it('function throws error with bad user', async () => {
    await expect(
      async () => await dataProvider.getUser('bad_id')
    ).rejects.toThrowError();
  });

  it('wrapper function gets correct total budget', async () => {
    const user = await dataProvider.getUser('test_user1');
    assert.equal(user!.total_budget, 2000);
  });

  it('wrapper function gets correct remaining budget', async () => {
    const user = await dataProvider.getUser('test_user1');
    assert.equal(user!.remaining_budget, 1000);
  });

  it('wrapper function gets correct pending event', async () => {
    const user = await dataProvider.getUser('test_user1');
    assert.equal(user!.pending_event, 5);
  });

  it('wrapper function gets correct completed event', async () => {
    const user = await dataProvider.getUser('test_user1');
    assert.equal(user!.completed_event, 10);
  });

  it('wrapper function gets correct planned event', async () => {
    const user = await dataProvider.getUser('test_user1');
    assert.equal(user!.planned_event, 5);
  });
});
