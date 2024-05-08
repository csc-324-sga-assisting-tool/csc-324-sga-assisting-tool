import {Dashboard} from 'app/dashboard/dashboard';
import {expect, describe, it} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';
import {LocalDatabase} from '../utils/database.local';
import {DataModel, User} from 'lib/data';
import {Collections} from 'lib/firebase';

describe('Test Dashboard works as Expected', () => {
  const mockUser: User = {
    id: 'test_user',
    name: 'Test Org',
    user_type: 'RSO',
    remaining_budget: 100,
    total_budget: 1000,
    pending_event: 3,
    planned_event: 5,
    completed_event: 2,
  };
  const mockDatabase = new LocalDatabase();
  mockDatabase.addDocument(Collections.Users, mockUser);

  const mockDataprovider = new DataModel(mockDatabase);
  const props = {
    user: mockUser,
    dataModel: mockDataprovider,
    TESTING_FLAG: true,
  };

  it('renders navbar and siderbar correctly with no budgets', async () => {
    // make sure there are no budgets
    mockDatabase.emptyCollection(Collections.Budgets);
    //render the daashboard
    // await Dashboard since it is an async component
    render(await Dashboard({...props}));

    // Check that the side bar is rendered
    expect(screen.queryByText('Summary')).toBeInTheDocument();
    // Check that the remaining budget is rendered
    expect(screen.queryByText('$ 100')).toBeInTheDocument();
    // Check that the Add Button is rendered
    expect(
      screen.queryByTestId('new-budget-form-button-add')
    ).toBeInTheDocument();
    // We have no budgets so nothing with Cost should be rendered
    expect(screen.queryByTestId('Cost')).toBeNull();
  });

  it('displays budget and sidebar correctly', async () => {
    // make sure there are no budgets
    mockDatabase.setCollection(Collections.Budgets, [
      {
        id: 'test_budget',
        user_id: 'test_user',
        event_name: 'Test Event',
        event_description: 'Test Event Description',
        current_status: 'submitted',
        total_cost: 123,
        status_history: [{status: 'submitted', when: new Date().toISOString()}],
        items: [],
      },
    ]);

    // await Dashboard since it is an async component
    render(await Dashboard({...props}));

    // Check that the side bar is rendered
    expect(screen.queryByText('Summary')).toBeInTheDocument();
    // Check that the remaining budget is rendered
    expect(screen.queryByText('$ 100')).toBeInTheDocument();
    // Check that the Add Button is rendered
    expect(
      screen.queryByTestId('new-budget-form-button-add')
    ).toBeInTheDocument();
    // 0 dollars, the cost of the budget should be rendered
    expect(
      await screen.findByText('$ 123', {exact: false})
    ).toBeInTheDocument();
    // Test Event, the name of the budget should be rendered
    expect(await screen.findByText('Test Event')).toBeInTheDocument();
  });

  it('make budget forms creates a new budget', async () => {
    // setup the userEvents library
    const user = userEvent.setup();

    mockDatabase.emptyCollection(Collections.Budgets);

    //render the daashboard
    render(await Dashboard({...props}));

    expect(
      screen.queryByTestId('new-budget-form-button-add')
    ).toBeInTheDocument();
    // Click the new button form
    await user.click(screen.getByTestId('new-budget-form-button-add'));
    // Check that the form fields are present*
    const formInputs = await screen.findAllByTestId(/new-budget-form/);
    formInputs.forEach(element => expect(element).toBeVisible());

    // submit a new budget
    const nameInput = await screen.findByTestId('new-budget-form-input-name');
    const descriptionInput = await screen.findByTestId(
      'new-budget-form-input-description'
    );
    const submitButton = await screen.findByTestId(
      'new-budget-form-button-submit'
    );

    await user.type(nameInput, 'Dance Party');
    await user.type(descriptionInput, "Dance till you can't any more");
    await user.click(submitButton);

    const budgets = await mockDataprovider.getBudgets();
    expect(budgets.length).toBe(1);
  });

  it('unfilled form will not create a budget', async () => {
    // setup the userEvents library
    const user = userEvent.setup();
    // make sure there are no budgets
    mockDatabase.emptyCollection(Collections.Budgets);
    //render the daashboard
    render(await Dashboard({...props}));

    expect(
      screen.queryByTestId('new-budget-form-button-add')
    ).toBeInTheDocument();
    // Click the new button form
    await user.click(screen.getByTestId('new-budget-form-button-add'));

    // Check that the form fields are present*
    const formInputs = await screen.findAllByTestId(/new-budget-form/);
    formInputs.forEach(element => expect(element).toBeVisible());

    const descriptionInput = await screen.findByTestId(
      'new-budget-form-input-description'
    );
    const submitButton = await screen.findByTestId(
      'new-budget-form-button-submit'
    );

    await user.type(descriptionInput, "Dance till you can't any more");
    await user.click(submitButton);
    await user.click(submitButton);

    const budgets = await mockDataprovider.getBudgets();
    expect(budgets.length).toBe(0);
  });

  it('make budget form populates budget with correct data', async () => {
    // setup the userEvents library
    const user = userEvent.setup();

    mockDatabase.emptyCollection(Collections.Budgets);
    //render the daashboard
    // await Dashboard since it is an async component
    render(await Dashboard({...props}));

    // await Dashboard since it is an async component

    // Check that the form fields are present*
    expect(
      screen.queryByTestId('new-budget-form-button-add')
    ).toBeInTheDocument();
    // Click the new button form
    await user.click(screen.getByTestId('new-budget-form-button-add'));

    const formInputs = await screen.findAllByTestId(/new-budget-form/);
    formInputs.forEach(element => expect(element).toBeVisible());

    // submit a new budget
    const nameInput = await screen.findByTestId('new-budget-form-input-name');
    const descriptionInput = await screen.findByTestId(
      'new-budget-form-input-description'
    );
    const dateInput = await screen.findByTestId(
      'new-budget-form-input-datepicker'
    );
    const locationInput = await screen.findByTestId(
      'new-budget-form-input-location'
    );

    const submitButton = await screen.findByTestId(
      'new-budget-form-button-submit'
    );
    const typeInput = await screen.findByTestId(
      'new-budget-form-input-event-type'
    );

    const name = 'Dance Party';
    const description = "Dance till you can't any more";
    const location = 'Main Pit';
    const testDate = new Date('2027-1-1');

    await user.type(nameInput, name);
    await user.type(descriptionInput, description);
    await user.type(locationInput, location);
    fireEvent.change(typeInput, {target: {value: 'Other'}});
    //Toggle Date
    await user.click(dateInput);
    await user.click(await screen.findByText('2024', {exact: false}));
    await user.click(await screen.findByText('2024', {exact: false}));
    await user.click(await screen.findByText('2027', {exact: false}));
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

  it('duplicates a budget successfully when duplicate button is clicked', async () => {
    // setup initial budget
    mockDatabase.setCollection(Collections.Budgets, [
      {
        id: 'test_budget',
        user_id: 'test_user',
        event_name: 'Test Event',
        event_description: 'Test Event Description',
        current_status: 'submitted',
        total_cost: 123,
        status_history: [{status: 'submitted', when: new Date().toISOString()}],
        items: [],
      },
    ]);

    // Render the Dashboard
    render(await Dashboard({...props}));

    // setup the userEvents library
    const user = userEvent.setup();

    // Click the duplicate button
    console.log(screen.debug());
    const duplicateButton = await screen.findByTestId(
      'budget-view-duplicate-budget'
    );
    await user.click(duplicateButton);

    // Fetch the budgets after duplication
    const budgets = await mockDataprovider.getBudgets();

    // Check that there are now two budgets
    expect(budgets.length).toBe(2);
    expect(budgets[1].id).not.toBe(budgets[0].id); // Check the ID of the duplicated budget if it follows a naming convention
    expect(budgets[1].event_name).toBe(budgets[0].event_name + ' - Copy'); // Check if the duplicated budget has '- Copy' in its name
  });
});
