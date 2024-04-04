"use client";

import { Sidebar } from "flowbite-react";

type SummaryProps = {
  total: number,
  remaining: number,
  pendingEvents: number,
  plannedEvents: number,
  completedEvents: number,
}


function SummarySidebar(props: SummaryProps) {
  return (
    <Sidebar className="sidebar h-screen fixed" aria-label="RSO Summary Sidebar">
      <Sidebar.Items>
        <Sidebar.ItemGroup>

          <Sidebar.Item>
            <h1 className="text-2xl">
              Summary
            </h1>
          </Sidebar.Item>

        </Sidebar.ItemGroup>

        <Sidebar.ItemGroup>

          <Sidebar.Item>
            <h1 className="text-lg">
              Budget
            </h1>
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
            <h1 className="text-lg">
              Events
            </h1>
          </Sidebar.Item>

          <Sidebar.Item label={`${props.pendingEvents}`} labelColor="amber">
            Pending
          </Sidebar.Item>

          <Sidebar.Item label={`${props.completedEvents}`} labelColor="green">
            Completed
          </Sidebar.Item>

          <Sidebar.Item label={`${props.plannedEvents}`}>
            Planned
          </Sidebar.Item>

        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar >
  );
}

export type { SummaryProps }
export { SummarySidebar }
