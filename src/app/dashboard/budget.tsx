'use client';

import {Status, Budget} from 'lib/data';
import {Color} from 'lib/color.types';
import {FiCopy, FiEdit} from 'react-icons/fi';
import Link from 'next/link';

export type BudgetProps = {
  title: string;
  id: string;
  description: string;
  status: Status;
  lastStatusDate: string;
  total: number;
  organizer?: string;
};

function BudgetStatusDisplay({status}: {status: Status}) {
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
    <div>
      <span className="text-md text-black float-left">Status: </span>
      <span
        className={`px-2 w-fit items-center justify-center text-md font-medium text-${color}-800 bg-${color}-100 rounded-full dark:bg-${color}-700 dark:text-${color}-500 float-right`}
      >
        {text}
      </span>
    </div>
  );
}

function DateDisplay({dateISO}: {dateISO: string}) {
  const date = new Date(dateISO);
  const month = date.toLocaleString('default', {month: 'long'});
  const day = date.getDate();
  const year = date.getFullYear();
  return (
    <span className="text-md dark:text-gray-100 text-black float-right">
      {month} {day}, {year}
    </span>
  );
}
// If the organizer is false, it will not be displayed
export function BudgetDisplay(props: BudgetProps) {
  return (
    <Link href={`/budget/${props.id}`}>
      <div
        className="grid grid-cols-10 gap-4 bg-white hover:bg-gray=200 shadow-md rounded-lg pt-4 pb-4 m-5 ml-72 divide-x divide-solid max-w-3xl budgetCard"
        data-testid="BudgetDisplay"
      >
        {props.organizer && (
          <div className="h-full col-span-1 items-center justify-center">
            <span className="text-sm text-bold text-black justify-center h-full w-full p-2">
              {props.organizer}
            </span>
          </div>
        )}
        <div className="h-full items-center justify-center col-span-2 p-4">
          <span className="text-xl text-bold text-black justify-center h-full w-full">
            {props.title}
          </span>
        </div>
        <div className="col-span-3 grid grid-row-2 p-2">
          <BudgetStatusDisplay status={props.status} />
          <div>
            <DateDisplay dateISO={props.lastStatusDate} />
          </div>
        </div>
        <div className="col-span-3 p-2">
          <span className="text-lg text-black float-left">Cost: </span>
          <span className="text-lg text-black float-right text-bold">
            $ {props.total}
          </span>
        </div>
        <div className="col-span-1 p-2 items-center justify-center grid grid-row-2 divide-y divide-dashed">
          <FiEdit />
          <FiCopy />
        </div>
      </div>
    </Link>
  );
}

export function BudgetList(props: {
  budgets: Budget[];
  show_organizer: boolean;
}) {
  return (
    <>
      {props.budgets.map((budget: Budget) => (
        <BudgetDisplay
          id={budget.id}
          key={budget.id}
          organizer={props.show_organizer ? budget.user_name : undefined}
          title={budget.event_name}
          description={budget.event_description}
          total={budget.total_cost}
          status={budget.current_status}
          lastStatusDate={budget.status_history[0]!.when}
        />
      ))}
    </>
  );
}
