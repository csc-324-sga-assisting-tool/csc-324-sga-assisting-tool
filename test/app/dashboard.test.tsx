import {Dashboard} from 'app/dashboard/dashboard';
import {expect, describe, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';
import {LocalDatabase} from '../utils/database.local';
import {DataModel, Sort, User, userIsSGA} from 'lib/data';
import {Collections} from 'lib/firebase';

function testDashboard(user: User) {
  describe(`Test Dashboard works as Expected for ${user.user_name}`, () => {
    const sgaUser = userIsSGA(user);
    const mockDatabase = new LocalDatabase();
    mockDatabase.addDocument(Collections.Users, user);
    const defaultSort: Sort = {
      field: 'id',
      isAscending: false,
    };

    const mockDataprovider = new DataModel(mockDatabase);
    const props = {
      userID: user.id,
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
      if (!sgaUser) {
        expect(
          screen.queryByText(`$ ${user.remaining_budget}`)
        ).toBeInTheDocument();
        // Check that the Add Button is rendered
        expect(
          screen.queryByTestId('new-budget-form-button-add')
        ).toBeInTheDocument();
      }
      // Check the the filter and sort options are present
      expect(screen.queryByTestId('Filter')).toBeInTheDocument();
      expect(screen.queryByTestId('Sort')).toBeInTheDocument();
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
          status_history: [
            {status: 'submitted', when: new Date().toISOString()}
          ],
          items: [],
        },
      ]);

      // await Dashboard since it is an async component
      render(await Dashboard({...props}));

      // Check that the side bar is rendered
      expect(screen.queryByText('Summary')).toBeInTheDocument();
      // Check that the remaining budget is rendered
      if (!sgaUser) {
        expect(
          screen.queryByText(`$ ${user.remaining_budget}`)
        ).toBeInTheDocument();
        // Check that the Add Button is rendered
        expect(
          screen.queryByTestId('new-budget-form-button-add')
        ).toBeInTheDocument();
      }
      // Check the the filter and sort options are present
      expect(screen.queryByTestId('Filter')).toBeInTheDocument();
      expect(screen.queryByTestId('Sort')).toBeInTheDocument();
      // 0 dollars, the cost of the budget should be rendered
      expect(
        await screen.findByText('$ 123', {exact: false})
      ).toBeInTheDocument();
      // Test Event, the name of the budget should be rendered
      expect(await screen.findByText('Test Event')).toBeInTheDocument();
      // Test Event, the name of the student org should only be rendered if the user is an SGA user
      if (sgaUser) {
        // Check that 'Test Org' is rendered within an element with classname budgetCard
        // TODO: How to make sure that the element with the classname budgetCard is the parent of 'Test Org'
        expect(screen.queryByText('Test Org')).toBeInTheDocument();
      } else {
        // Check that 'Test Org' is not rendered
        // TODO: This will not work because 'Test Org' should be rendered in the sidebar
        // What this should do is check that it's specifically not rendered in an budgetCard
        // element
        //expect(screen.queryByText('Test Org')).toBeNull();
      }
    });

    if (!sgaUser) {
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

        const budgets = await mockDataprovider.getBudgets([], 25, defaultSort);
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

        const budgets = await mockDataprovider.getBudgets([], 25, defaultSort);
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

        expect(
          screen.queryByTestId('new-budget-form-button-add')
        ).toBeInTheDocument();
        // Click the new button form
        await user.click(screen.getByTestId('new-budget-form-button-add'));

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

        const name = 'Dance Party';
        const description = "Dance till you can't any more";
        const location = 'Main Pit';

        await user.type(nameInput, name);
        await user.type(descriptionInput, description);
        await user.type(locationInput, location);

        // Set date to the day after today
        const today = new Date();
        await user.click(dateInput);
        await user.click(await screen.findByText(today.getDate()));

        await user.click(submitButton);

        const budgets = await mockDataprovider.getBudgets();

        expect(budgets.length).toBe(1);
        expect(budgets[0].event_name).toBe(name);
        expect(budgets[0].event_description).toBe(description);
        expect(budgets[0].event_location).toBe(location);
        expect(new Date(budgets[0].event_datetime!).getDate()).toBe(
          today.getDate()
        );
      });
    }
  });
}

testDashboard({
  id: 'test_user',
  name: 'Test Org',
  user_type: 'RSO',
  remaining_budget: 100,
  total_budget: 1000,
  pending_event: 3,
  planned_event: 5,
  completed_event: 2,
});
