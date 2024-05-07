'use client';

import {PropsWithChildren} from 'react';
import {Sidebar, Button} from 'flowbite-react';
import {Budget, Item, Status, StatusChange} from 'lib/data';
import {Color} from 'lib/color.types';
import {EditBudgetForm} from './editBudgetForm';
import {submitBudgetAction} from './actions';
import {ReviewActionController} from './review_actions';

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

function BudgetViewSidebar(props: PropsWithChildren<{}>) {
  return (
    <Sidebar
      className="sidebar h-screen fixed"
      aria-label="RSO Summary Sidebar"
    >
      <Sidebar.Items> {props.children} </Sidebar.Items>
    </Sidebar>
  );
}

function BudgetTitle(props: {budget: Budget}) {
  const budget = props.budget;
  return (
    <Sidebar.ItemGroup>
      <Sidebar.Item>
        <h1 className="text-lg">{budget.event_name}</h1>
      </Sidebar.Item>

      <StatusDisplay
        status={budget.current_status}
        when={budget.status_history[0]!.when}
      />
    </Sidebar.ItemGroup>
  );
}

function EventSummary(props: {budget: Budget}) {
  const budget = props.budget;
  return (
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
  );
}

function ItemsSummary(props: {budget: Budget; item_count: number}) {
  const budget = props.budget;
  const item_count = props.item_count;
  return (
    <Sidebar.ItemGroup>
      <Sidebar.Item>
        <h1 className="text-lg">Items</h1>
      </Sidebar.Item>

      <Sidebar.Item label={item_count} labelColor="amber">
        Total Quantity
      </Sidebar.Item>
      <Sidebar.Item label={`${budget.total_cost}`} labelColor="green">
        Total Cost
      </Sidebar.Item>
    </Sidebar.ItemGroup>
  );
}

function BudgetDetails(props: {budget: Budget; item_count: number}) {
  return (
    <>
      <BudgetTitle budget={props.budget} />
      <EventSummary budget={props.budget} />
      <ItemsSummary budget={props.budget} item_count={props.item_count} />
    </>
  );
}

function EditSubmitBudgetTools(props: {
  budget: Budget;
  updateBudgetAction: (
    budget: Budget,
    backToDashboard?: boolean
  ) => Promise<void>;
}) {
  const onSubmit = () => {
    submitBudgetAction(props.budget);
  };

  return (
    <Sidebar.ItemGroup>
      <EditBudgetForm
        budget={props.budget}
        updateBudgetAction={props.updateBudgetAction}
      />
      <Button
        onClick={onSubmit}
        className="bg-pallete-5 w-full"
        data-testid="submit-budget-button"
      >
        Submit
      </Button>
    </Sidebar.ItemGroup>
  );
}

function ApproveDenyBudgetTools({
  budget,
  items,
  reviewActionController,
}: {
  budget: Budget;
  items: Item[];
  reviewActionController: ReviewActionController;
}) {
  let itemsAreDenied = false;
  for (const item of items) {
    if (item.current_status === 'denied') {
      itemsAreDenied = true;
      break;
    }
  }

  return (
    <Sidebar.ItemGroup>
      <Button
        onClick={() => reviewActionController.approveBudget(budget)}
        disabled={itemsAreDenied}
        className="bg-pallete-5 w-full"
        data-testid="approve-budget-button"
      >
        Approve Budget
      </Button>
      <Button
        onClick={() => reviewActionController.denyBudget(budget)}
        disabled={false}
        className="bg-pallete-5 w-full"
        data-testid="deny-budget-button"
      >
        Deny Budget
      </Button>
      {/*<Button
        onClick={() => reviewActionController.clearComments(budget)}
        disabled={!itemsAreDenied}
        className="bg-pallete-5 w-full"
      >
        Clear Comments
      </Button>*/}
    </Sidebar.ItemGroup>
  );
}

function RSOBudgetViewSidebar({
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
  return (
    <BudgetViewSidebar>
      <BudgetDetails budget={budget} item_count={item_count} />

      {budget.current_status === 'created' && (
        <EditSubmitBudgetTools
          budget={budget}
          updateBudgetAction={updateBudgetAction}
        />
      )}
    </BudgetViewSidebar>
  );
}

function SGABudgetViewSidebar({
  budget,
  items,
  reviewActionController,
}: {
  budget: Budget;
  items: Item[];
  reviewActionController: ReviewActionController;
}) {
  return (
    <BudgetViewSidebar>
      <BudgetDetails budget={budget} item_count={items.length} />

      {budget.current_status === 'submitted' && (
        <ApproveDenyBudgetTools
          budget={budget}
          items={items}
          reviewActionController={reviewActionController}
        />
      )}
    </BudgetViewSidebar>
  );
}
export type {BudgetSidebarProps};
export {RSOBudgetViewSidebar, SGABudgetViewSidebar};
