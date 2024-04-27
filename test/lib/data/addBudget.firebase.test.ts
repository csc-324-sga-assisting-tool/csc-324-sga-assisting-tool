import {assert, beforeAll, it, describe, expect} from 'vitest';
import {getFirestore} from 'firebase/firestore';
import {Budget, DataModel, User} from 'lib/data';
import {Collections} from 'lib/firebase';
import {getLocalFirebase} from '../../utils/database.util';

const db = getFirestore();
const database = getLocalFirebase(db);

beforeAll(async () => {
  const testUser: User = {
    id: 'test_user',
    name: 'test_user',
    total_budget: 2000,
    remaining_budget: 1000,
    pending_event: 10,
    completed_event: 10,
    planned_event: 10,
    user_name: 'test_user1',
    user_type: 'RSO',
  };

  await database.addDocument(Collections.Users, testUser);
});

describe('test addBudget', () => {
  const testBudgets: Budget[] = [1, 2, 3].map(number => {
    return {
      id: `budget_${number}`,
      user_id: 'test_user',
      user_name: 'test_user',
      event_name: `event_name_${number}`,
      event_description: 'test description',
      event_type: 'Harris',
      total_cost: number * 100,
      current_status: 'created',
      status_history: [
        {
          status: 'created',
          when: new Date('2001-01-01').toISOString(),
        },
      ],
      prev_comments: [],
      comment: '',
      denied_items: [],
    };
  });
  const dataModel = new DataModel(database);
  it('should increment planned_event by 1 and add the budget if user exists', async () => {
    const user = await dataModel.getUser('test_user');
    await dataModel.addBudget(testBudgets[0]);
    const updatedUser = await dataModel.getUser('test_user');
    expect(updatedUser.planned_event).toEqual(user.planned_event + 1);
  });
});

describe('test addBudget 2', async () => {
  const dataModel = new DataModel(database);
  it('should send error message if user does not exist', async () => {
    const budgetToAddError: Budget = {
      id: 'test_error',
      user_name: 'user_error',
      user_id: 'user_error',
      event_name: 'error_event',
      event_description: 'error_description',
      event_datetime: 'error_000',
      event_location: 'error_test',
      event_type: 'Other',
      total_cost: 100,
      current_status: 'created',
      status_history: [
        {
          status: 'created',
          when: new Date('2001-01-01').toISOString(),
        },
      ],
      prev_comments: [],
      comment: '',
      denied_items: [],
    };
    try {
      await dataModel.addBudget(budgetToAddError);
      assert.fail('The function should have thrown an error but did not');
    } catch (error) {
      if (error instanceof Error) {
        assert.equal(
          error.message,
          'Document with id user_error does not exist in collection users',
          'Expected error message not received'
        );
      } else {
        assert.fail('Caught an error, but it is not an instance of Error');
      }
    }
  });
});
