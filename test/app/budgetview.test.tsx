import {expect, describe, it} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {LocalDatabase} from '../utils/database.local';
import {userEvent} from '@testing-library/user-event';
import {DataModel, User, createUser, createBudget} from 'lib/data';
import {Collections} from 'lib/firebase';
import {RSOBudgetView} from 'app/budget/[budget_id]/budgetview';

describe('Test Budget View works as expected', async () => {
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

  const mockDatabase = new LocalDatabase();
  mockDatabase.emptyCollection(Collections.Budgets);
  mockDatabase.addDocument(Collections.Users, userSEPC);

  const mockDataprovider = new DataModel(mockDatabase);
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

  const props = {
    budget_id: 'test_budget_view',
    dataModel: mockDataprovider,
    TESTING_FLAG: true,
  };

  it('check if add item correctly adds an item', async () => {
    // setup the userEvents library
    const user = userEvent.setup();

    mockDatabase.emptyCollection(Collections.Items);
    //render the daashboard
    render(await RSOBudgetView({...props}));
    expect(
      screen.queryByTestId('new-item-form-button-add')
    ).toBeInTheDocument();
    // Click the new button form
    await user.click(screen.getByTestId('new-item-form-button-add'));
    // Check that the form fields are present*
    const formInputs = await screen.findAllByTestId(/new-item-form/);
    formInputs.forEach(element => expect(element).toBeVisible());

    // submit a new item
    const nameInput = await screen.findByTestId('new-item-form-input-name');
    const vendorInput = await screen.findByTestId('new-item-form-input-vendor');
    const costInput = await screen.findByTestId('new-item-form-input-cost');
    const quantInput = await screen.findByTestId(
      'new-item-form-input-quantity'
    );
    const submitButton = await screen.findByTestId(
      'new-item-form-button-submit'
    );

    await user.type(nameInput, 'Diet Pepsi');
    await user.type(vendorInput, 'Amazon');
    await user.type(costInput, '10');
    await user.type(quantInput, '2');
    await user.click(submitButton);

    const items = await mockDataprovider.getItemsForBudget(props.budget_id);
    expect(items.length).toBe(1); // Error
  });

  it('incorrectly filled add item form will not create a new item', async () => {
    // setup the userEvents library
    const user = userEvent.setup();
    mockDatabase.emptyCollection(Collections.Items);

    render(await RSOBudgetView({...props}));
    expect(
      screen.queryByTestId('new-item-form-button-add')
    ).toBeInTheDocument();
    // Click the new button form
    await user.click(screen.getByTestId('new-item-form-button-add'));
    // Check that the form fields are present*
    const formInputs = await screen.findAllByTestId(/new-item-form/);
    formInputs.forEach(element => expect(element).toBeVisible());

    // submit a new budget
    const nameInput = await screen.findByTestId('new-item-form-input-name');
    const vendorInput = await screen.findByTestId('new-item-form-input-vendor');
    const quantInput = await screen.findByTestId(
      'new-item-form-input-quantity'
    );
    const submitButton = await screen.findByTestId(
      'new-item-form-button-submit'
    );

    await user.type(nameInput, 'Diet Pepsi');
    await user.type(vendorInput, 'Amazon');
    await user.type(quantInput, '2');
    await user.click(submitButton);

    const items = await mockDataprovider.getItemsForBudget(props.budget_id);
    expect(items.length).toBe(0);
  });

  it('check if edit bugdget button works as intended', async () => {
    // setup the userEvents library
    const user = userEvent.setup();
    // print(dataModel
    render(await RSOBudgetView({...props}));

    // Check that the form fields are present*
    expect(
      screen.queryByTestId('edit-budget-form-button-add')
    ).toBeInTheDocument();
    // Click the new button form
    await user.click(screen.getByTestId('edit-budget-form-button-add'));

    const formInputs = await screen.findAllByTestId(/edit-budget-form/);
    formInputs.forEach(element => expect(element).toBeVisible());

    // submit a new budget
    const nameInput = await screen.findByTestId('edit-budget-form-input-name');
    const descriptionInput = await screen.findByTestId(
      'edit-budget-form-input-description'
    );
    const dateInput = await screen.findByTestId(
      'edit-budget-form-input-datepicker'
    );
    const locationInput = await screen.findByTestId(
      'edit-budget-form-input-location'
    );

    const submitButton = await screen.findByTestId(
      'edit-budget-form-button-submit'
    );
    const typeInput = await screen.findByTestId(
      'edit-budget-form-input-event-type'
    );

    const name = 'Dance Party';
    const description = "Dance till you can't any more";
    const location = 'Main Pit';
    const testDate = new Date('2027-1-1');
    await user.clear(nameInput);
    await user.clear(descriptionInput);
    await user.clear(locationInput);

    await user.type(nameInput, name);
    await user.type(descriptionInput, description);
    await user.type(locationInput, location);
    fireEvent.change(typeInput, {target: {value: 'Other'}});
    //Toggle Date
    // fireEvent.change(dateInput, {target: {value: testDate.getDate}});
    await user.click(dateInput);
    await user.click(await screen.findByText('May 2024', {exact: true}));
    await user.click(await screen.findByText('2024', {exact: true}));
    await user.click(await screen.findByText('2027', {exact: true}));
    await user.click(await screen.findByText('Jan', {exact: false}));
    await user.click((await screen.findAllByText('1'))[0]);
    await user.click(submitButton);

    const budgets = await mockDataprovider.getBudgets();
    expect(budgets.length).toBe(1);
    expect(budgets[0].event_name).toBe(name);
    expect(budgets[0].event_description).toBe(description);
    expect(budgets[0].event_location).toBe(location);
    expect(new Date(budgets[0].event_datetime!).getDate()).toBe(
      testDate.getDate()
    );
  });
  it('check if submit button works as intended', async () => {
    // setup the userEvents library
    const user = userEvent.setup();
    render(await RSOBudgetView({...props}));
    expect(screen.queryByTestId('submit-budget-button')).toBeInTheDocument();

    await user.click(screen.getByTestId('submit-budget-button'));
    const budget = await mockDataprovider.getBudget(props.budget_id);

    expect(budget.current_status).toBe('submitted');
    expect(budget.status_history.length).toBe(2);
  });
});
