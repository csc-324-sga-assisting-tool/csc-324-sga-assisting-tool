import { Dashboard } from 'app/dashboard/dashboard';
import { MockDataStore } from '../utils/data_loader.mock';
import { expect, describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

describe('Test Dashboard works as Expected', () => {
  const mockDataprovider = new MockDataStore();
  mockDataprovider.setUsers([
    {
      user_id: 'test_user',
      user_name: 'Test Org',
      user_type: 'RSO',
      remaining_budget: 100,
      total_budget: 1000,
      pending_event: 3,
      planned_event: 5,
      completed_event: 2,
    },
  ]);

  it('renders navbar and siderbar correctly with no budgets', async () => {
    // make sure there are no budgets
    mockDataprovider.setBudgets([]);

    //render the daashboard
    const props = {
      userID: 'test_user',
      dataProvider: mockDataprovider,
      dataModifier: mockDataprovider,
      TESTING_FLAG: true,
    };
    // await Dashboard since it is an async component
    render(await Dashboard({ ...props }));

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

  it('make budget forms creates a new budget', async () => {
    // setup the userEvents library
    const user = userEvent.setup();
    // make sure there are no budgets
    mockDataprovider.setBudgets([]);

    // render dashboard
    const props = {
      userID: 'test_user',
      dataProvider: mockDataprovider,
      dataModifier: mockDataprovider,
      TESTING_FLAG: true,
    };
    render(await Dashboard({ ...props }));

    expect(
      screen.queryByTestId('new-budget-form-button-add')
    ).toBeInTheDocument();
    // Click the new button form
    await user.click(screen.getByTestId('new-budget-form-button-add'));
    // Check that the form fields are present*
    screen
      .queryAllByTestId('new-budget-form-')
      .forEach(element => expect(element).toBeVisible());
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
    await user.click(submitButton);

    expect(mockDataprovider.budgets.length).toBe(1);
  });

  it('unfilled form will not create a budget', async () => {
    // setup the userEvents library
    const user = userEvent.setup();
    // make sure there are no budgets
    mockDataprovider.setBudgets([]);

    // render dashboard
    const props = {
      userID: 'test_user',
      dataProvider: mockDataprovider,
      dataModifier: mockDataprovider,
      TESTING_FLAG: true,
    };
    render(await Dashboard({ ...props }));

    expect(
      screen.queryByTestId('new-budget-form-button-add')
    ).toBeInTheDocument();
    // Click the new button form
    await user.click(screen.getByTestId('new-budget-form-button-add'));
    // Check that the form fields are present*
    screen
      .queryAllByTestId('new-budget-form-')
      .forEach(element => expect(element).toBeVisible());

    const descriptionInput = await screen.findByTestId(
      'new-budget-form-input-description'
    );
    const submitButton = await screen.findByTestId(
      'new-budget-form-button-submit'
    );

    await user.type(descriptionInput, "Dance till you can't any more");
    await user.click(submitButton);
    await user.click(submitButton);

    expect(mockDataprovider.budgets.length).toBe(0);
  });
});
