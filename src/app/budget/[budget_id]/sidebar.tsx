'use client';

import {Sidebar, Button} from 'flowbite-react';
import {Budget, Status, StatusChange} from 'lib/data';
import {Color} from 'lib/color.types';
import {EditBudgetForm} from './editBudgetForm';

type BudgetSidebarProps = {
  item_count: number;
};

function dateToString(dateISO: string): string {
  const date = new Date(dateISO);
  const month = date.toLocaleString('default', {month: 'long'});
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

function StatusDisplay({status, when}: {status: Status; when: string}) {
  let color: Color = 'gray';
  let text: String = 'Saved';
  switch (status) {
    case 'submitted':
      color = 'yellow';
      text = 'Pending';
      break;
    case 'created':
      color = 'gray';
      text = 'Saved';
      break;
    case 'approved':
      color = 'green';
      text = 'Approved';
      break;
    case 'denied':
      color = 'red';
      text = 'Denied';
      break;
  }
  return (
    <Sidebar.Item label={text} labelColor={color}>
      {dateToString(when)}
    </Sidebar.Item>
  );
}

function BudgetViewSidebar({
  budget,
  item_count,
  updateBudgetAction,
}: {
  budget: Budget;
  item_count: number;
  updateBudgetAction: (
    budget: Budget,
    backToDashboard?: boolean
  ) => Promise<void>;
}) {
  const submitBudget = () => {
    // TODO: Do validation here to make sure invalid budgets are not submitted
    const newStatus: StatusChange = {
      status: 'submitted',
      when: new Date().toISOString(),
    };
    const updatedStatusHistory = [newStatus];
    //Add the old statuses to the status history
    updatedStatusHistory.push(...budget.status_history);
    updateBudgetAction(
      {
        ...budget,
        status_history: updatedStatusHistory,
        current_status: newStatus.status,
      },
      true
    );
  };
  return (
    <Sidebar
      className="sidebar h-screen fixed"
      aria-label="Budget View Sidebar"
    >
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item>
            <h1 className="text-lg">{budget.event_name}</h1>
          </Sidebar.Item>

          <StatusDisplay
            status={budget.current_status}
            when={budget.status_history[0]!.when}
          />
        </Sidebar.ItemGroup>

        <Sidebar.ItemGroup>
          <Sidebar.Item label={budget.type}>Event Type</Sidebar.Item>
          {budget.event_datetime && (
            <Sidebar.Item label={dateToString(budget.event_datetime)}>
              Date
            </Sidebar.Item>
          )}
          {budget.event_location && (
            <Sidebar.Item label={budget.event_location}>Location</Sidebar.Item>
          )}
        </Sidebar.ItemGroup>

        <Sidebar.ItemGroup>
          <Sidebar.Item>
            <h1 className="text-lg">Items</h1>
          </Sidebar.Item>

          <Sidebar.Item label={item_count} labelColor="amber">
            Quantity
          </Sidebar.Item>
          <Sidebar.Item label={`${budget.total_cost}`} labelColor="green">
            Total Cost
          </Sidebar.Item>
        </Sidebar.ItemGroup>
        {budget.current_status === 'created' && (
          <Sidebar.ItemGroup>
            <EditBudgetForm
              budget={budget}
              updateBudgetAction={updateBudgetAction}
            />
            <Button
              onClick={submitBudget}
              className="bg-pallete-5 w-full"
              data-testid="submit-budget-button"
            >
              Submit
            </Button>
          </Sidebar.ItemGroup>
        )}
      </Sidebar.Items>
    </Sidebar>
  );
}

export type {BudgetSidebarProps};
export {BudgetViewSidebar};
