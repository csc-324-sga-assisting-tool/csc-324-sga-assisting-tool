import {assert, beforeAll, it, describe, expect} from 'vitest';
import {getFirestore} from 'firebase/firestore';
import {DataModel, User} from 'lib/data';
import {Collections} from 'lib/firebase';
import {getLocalFirebase} from '../../utils/database.util';

const db = getFirestore();
const database = getLocalFirebase(db);

beforeAll(async () => {
  const testUsers: User[] = [1, 2, 3].map(number => {
    return {
      id: `test_user${number}`,
      name: 'test_user1',
      total_budget: 2000,
      remaining_budget: 1000,
      pending_event: 5,
      completed_event: 10,
      planned_event: 5,
      user_type: 'RSO',
    };
  });

  database.addManyDocuments(Collections.Users, testUsers);
});

describe('test firebase getUser', () => {
  const dataModel = new DataModel(database);
  it('wrapper function gets correct user', async () => {
    const user = await dataModel.getUser('test_user1');
    assert.equal(user!.id, 'test_user1');
  });

  it('function throws error with bad user', async () => {
    await expect(
      async () => await dataModel.getUser('bad_id')
    ).rejects.toThrowError();
  });

  it('wrapper function gets correct total budget', async () => {
    const user = await dataModel.getUser('test_user1');
    assert.equal(user!.total_budget, 2000);
  });

  it('wrapper function gets correct remaining budget', async () => {
    const user = await dataModel.getUser('test_user1');
    assert.equal(user!.remaining_budget, 1000);
  });

  it('wrapper function gets correct pending event', async () => {
    const user = await dataModel.getUser('test_user1');
    assert.equal(user!.pending_event, 5);
  });

  it('wrapper function gets correct completed event', async () => {
    const user = await dataModel.getUser('test_user1');
    assert.equal(user!.completed_event, 10);
  });

  it('wrapper function gets correct planned event', async () => {
    const user = await dataModel.getUser('test_user1');
    assert.equal(user!.planned_event, 5);
  });
});
