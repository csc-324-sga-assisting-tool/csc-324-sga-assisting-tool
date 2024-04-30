import {assert, beforeAll, it, describe, expect} from 'vitest';
import {getFirestore} from 'firebase/firestore';
import {Budget, DataModel, Item, User} from 'lib/data';
import {Collections} from 'lib/firebase';
import {getLocalFirebase, clearCollection} from '../../utils/database.util';

const db = getFirestore();
const database = getLocalFirebase(db);

beforeAll(async () => {
  const testBudgets: Budget[] = [1, 2, 3].map(number => {
    return {
      id: `budget_${number}`,
      user_id: `user_${number}`,
      user_name: 'user_name',
      event_name: `event_name_${number}`,
      event_description: 'test description',
      total_cost: number * 100,
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
  });

  const testItems: Item[] = [1, 2, 3].map(number => {
    return {
      budget_id: `budget_${number}`,
      unit_price: 10.0,
      id: `item_${number}`,
      name: `testing item ${number}`,
      quantity: 2,
      rso_item_comment: null,
      sga_item_comment: null,
      url: 'test',
      vendor: 'test',
      current_status: 'created',
    };
  });

  await database.addManyDocuments(Collections.Budgets, testBudgets);
  await database.addManyDocuments(Collections.Items, testItems);
});

describe('Test changeBudgetStatus for current_status', async () => {
  const dataModel = new DataModel(database);
  it('should add status to budget', async () => {
    const budget = await dataModel.getBudget('budget_1');
    await dataModel.changeBudgetStatus(budget, 'denied');
    const updatedBudget = await dataModel.getBudget('budget_1');
    expect(updatedBudget.current_status).toEqual('denied');
  });
});

describe('Test changeBudgetStatus for status_history', async () => {
  const dataModel = new DataModel(database);
  it('should add status history to budget', async () => {
    const updatedBudget = await dataModel.getBudget('budget_1');
    const histories = updatedBudget.status_history.map(
      history => history.status
    );
    expect(histories).toEqual(['denied', 'created']);
  });
});

describe('Test changeItemStatus', async () => {
  const dataModel = new DataModel(database);
  it('should update status history of item', async () => {
    const items = await dataModel.getItemsForBudget('budget_1');
    if (items.length > 0) {
      await dataModel.changeItemStatus(items[0], 'denied');
      const updatedItems = await dataModel.getItemsForBudget('budget_1');
      const updatedItem = updatedItems.find(item => item.id === items[0].id);
      if (updatedItem) {
        expect(updatedItem.current_status).toEqual('denied');
      } else {
        throw new Error('Updated Item Not Found');
      }
    } else {
      throw new Error('No Items Found');
    }
  });
});
