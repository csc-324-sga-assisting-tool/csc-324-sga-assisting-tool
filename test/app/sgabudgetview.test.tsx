import {expect, describe, it, beforeEach} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {LocalDatabase} from '../utils/database.local';
import {userEvent} from '@testing-library/user-event';
import {DataModel, User, createUser, createBudget, createItem} from 'lib/data';
import {Collections} from 'lib/firebase';
import {SGABudgetView} from 'app/budget/[budget_id]/sgaBudgetView';

const mockDatabase = new LocalDatabase();
const mockDataprovider = new DataModel(mockDatabase);

async function initializeUsers() {
  const userSEPC = createUser({
    id: 'test_budget_view_user',
    name: 'John Doe',
    user_type: 'SEPC',
    remaining_budget: 100,
    total_budget: 1000,
    pending_event: 3,
    planned_event: 5,
    completed_event: 2,
  });
  const userSGA = createUser({
    id: 'sga_user',
    name: 'SGA Treasurer',
    user_type: 'SGA_Treasurer',
  });

  mockDatabase.emptyCollection(Collections.Users);
  mockDatabase.addDocument(Collections.Users, userSEPC);
  mockDatabase.addDocument(Collections.Users, userSGA);
}

async function initializeBudgets() {
  mockDatabase.setCollection(Collections.Budgets, [
    await createBudget({
      dataModel: mockDataprovider,
      id: 'test_budget_view',
      user_id: 'test_budget_view_user',
      event_name: 'Test Event',
      event_description: 'Test Event Description',
      event_location: 'Harris',
      event_type: 'Harris',
      event_datetime: '2024-5-1',
    }),
  ]);

  // Submit the budget
  await mockDataprovider.changeBudgetStatus(
    await mockDataprovider.getBudget('test_budget_view'),
    'submitted'
  );
}

async function initializeItems(budgetID: string) {
  const deniedItem = createItem({
    budget_id: budgetID,
    id: 'denied_item',
    name: 'Item 1',
    vendor: 'Amazon',
    unit_price: 10,
    quantity: 2,
  });
  await mockDatabase.emptyCollection(Collections.Items);
  await mockDataprovider.addItem(deniedItem);
}

beforeEach(async () => {
  await initializeUsers();
  await initializeBudgets();
  await initializeItems('test_budget_view');
});

describe('Test that SGA Budget View works as expected', async () => {
  const props = {
    budget_id: 'test_budget_view',
    user_id: 'sga_user',
    dataModel: mockDataprovider,
    TESTING_FLAG: true,
  };

  it('displays approve and deny buttons', async () => {
    render(await SGABudgetView({...props}));
    expect(screen.queryByTestId('deny-budget-button')).toBeInTheDocument();
    expect(screen.queryByTestId('approve-budget-button')).toBeInTheDocument();
  });
  // [This test was generated to github copilot]
  it('displays items', async () => {
    render(await SGABudgetView({...props}));
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('clicking deny item button denies the item', async () => {
    const user = userEvent.setup();
    render(await SGABudgetView({...props}));

    // Get a list of deny item buttons
    const itemDenyButtons = await screen.findAllByTestId('item-deny-button');
    expect(itemDenyButtons).toHaveLength(1);

    // Deny the first item
    await user.click(itemDenyButtons[0]);
    let item = await mockDataprovider.getItem('denied_item');
    expect(item.current_status).toBe('denied');

    // Undeny the first item
    await user.click(itemDenyButtons[0]);
    item = await mockDataprovider.getItem('denied_item');
    expect(item.current_status).toBe('created');
  });
  /*

  it('clicking deny budget button denies the whole budget', async () => {
    const user = userEvent.setup();
    render(await SGABudgetView({...props}));

    // Get the deny budget button
    const denyBudgetButton = screen.getByTestId('deny-budget-button');
    await user.click(denyBudgetButton);
    const budget = await mockDataprovider.getBudget(props.budget_id);
    expect(budget.current_status).toBe('denied');
  });

  it('clicking approve budget button approves the whole budget', async () => {
    const user = userEvent.setup();
    render(await SGABudgetView({...props}));

    // Get the deny budget button
    const approveBudgetButton = screen.getByTestId('approve-budget-button');
    await user.click(approveBudgetButton);
    const budget = await mockDataprovider.getBudget(props.budget_id);
    expect(budget.current_status).toBe('approved');
  });

  it('approve budget is disabled with denied items', async () => {
    const user = userEvent.setup();
    render(await SGABudgetView({...props}));

    // Get a list of deny item buttons
    const itemDenyButtons = await screen.findAllByTestId(/item-deny-button/);
    expect(itemDenyButtons).toHaveLength(2);

    // Deny the first item
    await user.click(itemDenyButtons[0]);

    // Get the deny budget button
    const denyBudgetButton = screen.getByTestId('approve-budget-button');

    // Attempt to approve the budget (it should be disabled)
    await user.click(denyBudgetButton);
    const budget = await mockDataprovider.getBudget(props.budget_id);
    expect(budget.current_status).toBe('submitted');
  });
  */
});
