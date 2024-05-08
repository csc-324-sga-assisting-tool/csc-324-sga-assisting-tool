'use client';

import {Sidebar} from 'flowbite-react';
import {PropsWithChildren} from 'react';
import {User} from 'lib/data';

export type SummaryProps = {
  total: number;
  remaining: number;
  pendingEvents: number;
  plannedEvents: number;
  completedEvents: number;
};

function DashboardSidebar(props: PropsWithChildren<{}>) {
  return (
    <Sidebar
      className="sidebar h-screen top-16 fixed"
      aria-label="RSO Summary Sidebar"
    >
      <Sidebar.Items> {props.children} </Sidebar.Items>
    </Sidebar>
  );
}

// Display the user's account name
function AccountPannel(user: User) {
  return (
    <Sidebar.ItemGroup>
      <Sidebar.Item>
        <h1 className="text-2xl">{user.name}</h1>
      </Sidebar.Item>
    </Sidebar.ItemGroup>
  );
}

function RSOSummary(props: SummaryProps) {
  return (
    <Sidebar.ItemGroup>
      <Sidebar.ItemGroup>
        <Sidebar.Item>
          <h1 className="text-2xl">Summary</h1>
        </Sidebar.Item>
      </Sidebar.ItemGroup>

      <Sidebar.ItemGroup>
        <Sidebar.Item>
          <h1 className="text-lg">Budget</h1>
        </Sidebar.Item>

        <Sidebar.Item label={`$ ${props.total}`} labelColor="dark">
          Total
        </Sidebar.Item>

        <Sidebar.Item label={`$ ${props.remaining}`} labelColor="green">
          Remaining
        </Sidebar.Item>
      </Sidebar.ItemGroup>

      <Sidebar.ItemGroup>
        <Sidebar.Item>
          <h1 className="text-lg">Events</h1>
        </Sidebar.Item>

        <Sidebar.Item label={`${props.pendingEvents}`} labelColor="amber">
          Pending
        </Sidebar.Item>

        <Sidebar.Item label={`${props.completedEvents}`} labelColor="green">
          Completed
        </Sidebar.Item>

        <Sidebar.Item label={`${props.plannedEvents}`}>Planned</Sidebar.Item>
      </Sidebar.ItemGroup>
    </Sidebar.ItemGroup>
  );
}

function BudgetListTools() {
  return (
    <Sidebar.ItemGroup>
      <Sidebar.Item>
        <h2 className="text-2xl" data-testid="Filter">
          Sort By
        </h2>
      </Sidebar.Item>

      <Sidebar.Item>
        <h2 className="text-2xl" data-testid="Sort">
          Filters
        </h2>
      </Sidebar.Item>
    </Sidebar.ItemGroup>
  );
}

export function SGADashboardSidebar(props: {user: User}) {
  return (
    <DashboardSidebar>
      <AccountPannel {...props.user} />
      <BudgetListTools />
    </DashboardSidebar>
  );
}
export function RSODashboardSidebar(props: {user: User}) {
  const summary = {
    total: props.user.total_budget,
    remaining: props.user.remaining_budget,
    pendingEvents: props.user.pending_event,
    plannedEvents: props.user.planned_event,
    completedEvents: props.user.completed_event,
  };
  return (
    <DashboardSidebar>
      <AccountPannel {...props.user} />
      <RSOSummary {...summary} />
      <BudgetListTools />
    </DashboardSidebar>
  );
}
