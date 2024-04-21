'use client';

import { Sidebar } from 'flowbite-react';
import { User } from 'lib/data';
import { userIsSGA } from 'lib/data/utils';

type SummaryProps = {
  total: number;
  remaining: number;
  pendingEvents: number;
  plannedEvents: number;
  completedEvents: number;
};

function DashboardSidebar(user: User) {
  const SGAUser = userIsSGA(user)
  const summary: SummaryProps = {
    total: user.total_budget,
    remaining: user.remaining_budget,
    pendingEvents: user.pending_event,
    plannedEvents: user.planned_event,
    completedEvents: user.completed_event,
  };
  return (
    <Sidebar
      className="sidebar h-screen fixed"
      aria-label="RSO Summary Sidebar"
    >
      <Sidebar.Items>
        <AccountPannel {...user} />
        {!SGAUser && <RSOSummary {...summary} />}
        <BudgetListTools />
      </Sidebar.Items>
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
        <h2 className="text-2xl">Sort By</h2>
      </Sidebar.Item>

      <Sidebar.Item>
        <h2 className="text-2xl">Filters</h2>
      </Sidebar.Item>
    </Sidebar.ItemGroup>
  );
}

export type { SummaryProps };
export { DashboardSidebar };
