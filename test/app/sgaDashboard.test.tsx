import { Dashboard } from 'app/dashboard/dashboard';
import { expect, describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { LocalDatabase } from '../utils/database.local';
import { DataModel, Sort, User, } from 'lib/data';
import { Collections } from 'lib/firebase';
import { SGADashboard } from 'app/dashboard/sgaDashboard';

describe(`Test Dashboard works as Expected`, () => {
  const userSGA: User = {
    id: 'test_sga_user',
    name: 'SGA Treasurer',
    user_type: 'SGA_Treasurer',
    remaining_budget: 100,
    total_budget: 1000,
    pending_event: 3,
    planned_event: 5,
    completed_event: 2,
  }
  const mockDatabase = new LocalDatabase();
  mockDatabase.addDocument(Collections.Users, userSGA);
  const defaultSort: Sort = {
    field: 'id',
    isAscending: false,
  };

  const mockDataprovider = new DataModel(mockDatabase);
  const props = {
    user: userSGA,
    dataModel: mockDataprovider,
    TESTING_FLAG: true,
  };

  it('renders navbar and siderbar correctly with no budgets', async () => {
    // make sure there are no budgets
    mockDatabase.emptyCollection(Collections.Budgets);
    //render the daashboard
    // await Dashboard since it is an async component
    render(await SGADashboard({ ...props }));

    // Check that the Add Button is not rendered
    expect(
      screen.queryByTestId('new-budget-form-button-add')
    ).toBeNull();
    // Check the the filter and sort options are present
    expect(screen.queryByTestId('Filter')).toBeInTheDocument();
    expect(screen.queryByTestId('Sort')).toBeInTheDocument();
  });

  it('displays budget and sidebar correctly', async () => {
    // make sure there are no budgets
    mockDatabase.setCollection(Collections.Budgets, [
      {
        id: 'test_budget',
        user_id: 'test_user',
        user_name: 'Test Org',
        event_name: 'Test Event',
        event_description: 'Test Event Description',
        current_status: 'submitted',
        total_cost: 123,
        status_history: [
          { status: 'submitted', when: new Date().toISOString() }
        ],
        items: [],
      },
    ]);

    // await Dashboard since it is an async component
    render(await SGADashboard({ ...props }));

    // Check that the side bar is rendered
    expect(screen.queryByText('Summary')).toBeInTheDocument();
    expect(await screen.findByText('Test Event')).toBeInTheDocument();
    expect(await screen.findByText('Test Org')).toBeInTheDocument();

  });

  it('does not display non pending budgets', async () => {
    // make sure there are no budgets
    mockDatabase.setCollection(Collections.Budgets, [
      {
        id: 'test_budget',
        user_id: 'test_user',
        event_name: 'Test Event',
        event_description: 'Test Event Description',
        current_status: 'created',
        total_cost: 123,
        status_history: [
          { status: 'submitted', when: new Date().toISOString() }
        ],
        items: [],
      },
    ]);

    // await Dashboard since it is an async component
    render(await SGADashboard({ ...props }));

    // Check that the side bar is rendered
    expect(screen.queryByText('Summary')).toBeInTheDocument();
    expect(await screen.findByText('Test Event')).toBeInTheDocument();
    expect(await screen.findByText('Test Org')).toBeInTheDocument();

    expect(screen.queryByText('Test Event')).toBeNull();
    expect(screen.queryByText('Test Org')).toBeNull();
  });
});

