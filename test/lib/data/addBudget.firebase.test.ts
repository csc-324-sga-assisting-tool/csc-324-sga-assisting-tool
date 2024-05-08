import {beforeAll, it, describe, expect} from 'vitest';
import {Budget, DataModel, User} from 'lib/data';
import {Collections} from 'lib/firebase';
import {getLocalFirebase, clearCollection} from '../../utils/database.util';
import {
  createItem,
  createBudget,
  createBudgetSync,
  createUser,
} from 'lib/data/utils';
import {defaultTestUser, defaultTestBudget} from '../../utils/defaults';
import {LocalDatabase} from '../../utils/database.local';

const database = new LocalDatabase();

beforeAll(async () => {
  await clearCollection(database, Collections.Users);
  await clearCollection(database, Collections.Budgets);

  const testUsers: User[] = [1, 2, 3].map(number => {
    return {
      ...defaultTestUser,
      id: `test_user${number}`,
    };
  });

  const testBudgets: Budget[] = [1, 2, 3].map(number => {
    return {
      ...defaultTestBudget,
      id: `budget_${number}`,
      user_id: `test_user${number}`,
    };
  });

  await database.addManyDocuments(Collections.Users, testUsers);
  await database.addManyDocuments(Collections.Budgets, testBudgets);
});

describe('test addBudget', () => {
  const dataModel = new DataModel(database);

  it('should increment planned_event by 1 and add the budget if user exists', async () => {
    const planned = (await dataModel.getUser('test_user3')).planned_event;
    const budgetToAdd = await dataModel.getBudget('budget_3');
    await dataModel.addBudget(budgetToAdd);
    const updatedUser = await dataModel.getUser('test_user3');
    expect(updatedUser.planned_event).toEqual(planned + 1);
  });

  it('should send error message if user does not exist', async () => {
    const budgetToAddError: Budget = createBudgetSync({
      id: 'test_error',
      user_id: 'user_error',
      user_name: 'user_error',
      event_name: 'error_event',
      event_description: 'error_description',
      event_datetime: 'error_000',
      event_location: 'error_test',
      event_type: 'Other',
    });
    await expect(async () =>
      dataModel.addBudget(budgetToAddError)
    ).rejects.toThrowError();
  });
});
