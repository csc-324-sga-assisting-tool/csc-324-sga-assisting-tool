import {getFirestore} from 'firebase/firestore';
import {getLocalFirebase} from '../../utils/database.util';
import {beforeAll, describe, expect, it} from 'vitest';
import {Budget, DataModel, Item, User} from 'lib/data';
import {Collections} from 'lib/firebase';

const db = getFirestore();
const database = getLocalFirebase(db);

beforeAll(async () => {
  const testUserID = 'duplicate_user_1';
  const testBudget: Budget = {
    id: 'budget_1',
    user_id: testUserID,
    user_name: 'user_1',
    event_name: 'event_name_1',
    event_description: 'test description',
    total_cost: 0,
    current_status: 'created',
    status_history: [
      {
        status: 'created',
        when: new Date('2001-01-01').toISOString(),
      },
    ],
    items: [],
    event_type: 'Other',
  };

  const items: Item[] = [1, 2, 3].map(num => {
    return {
      id: `item_${num}`,
      budget_id: 'budget_1',
      name: `item_${num}`,
      quantity: 1,
      unit_price: 10 * num,
      vendor: 'Walmart',
    };
  });

  const testUser: User = {
    id: testUserID,
    name: 'user_1',
    remaining_budget: 0,
    total_budget: 1000000,
    user_type: 'RSO',
    pending_event: 0,
    planned_event: 0,
    completed_event: 0,
  };

  database.addDocument(Collections.Budgets, testBudget);
  database.addDocument(Collections.Users, testUser);
  const dm = new DataModel(database);
  dm.addItems(items);
});

describe('duplicateBudget function', () => {
  const dataModel = new DataModel(database);

  it('should duplicate a budget correctly', async () => {
    // Fetch the original budget first
    const originalBudget = await dataModel.getBudget('budget_1');
    const originalItems = await dataModel.getItemsForBudget('budget_1');
    const newBudgetId = 'budget_1_copy';

    // Duplicate the budget
    await dataModel.duplicateBudget(originalBudget, newBudgetId);

    // Fetch the duplicated budget
    const duplicatedBudget = await dataModel.getBudget(newBudgetId);
    const duplicatedItems = await dataModel.getItemsForBudget('budget_1');

    // Check if the duplicated budget has the correct updated name and other properties
    expect(duplicatedBudget!.event_name).toBe(
      `${originalBudget!.event_name} - Copy`
    );
    expect(duplicatedBudget!.id).toBe(newBudgetId);

    // Test items were duplicated correctly
    expect(duplicatedItems.length).toBe(3); // Assumes the original budget had 3 items
    duplicatedItems.forEach((item, index) => {
      // New ID for items
      const originalItem = originalItems[index];
      expect(item!.id).toBe(originalItem.id);

      // Test that name, unit price, and quantity remain unchanged
      expect(item.name).toBe(originalItem.name);
      expect(item.unit_price).toBe(originalItem.unit_price);
      expect(item.quantity).toBe(originalItem.quantity);
    });
  });
});
