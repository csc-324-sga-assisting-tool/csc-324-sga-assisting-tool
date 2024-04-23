'use client';

import {Status} from 'lib/data';
import {Color} from 'lib/color.types';
import {FiCopy, FiEdit} from 'react-icons/fi';
import Link from 'next/link';
import {Budget} from 'lib/data';

export type BudgetProps = {
  title: string;
  id: string;
  description: string;
  status: Status;
  lastStatusDate: string;
  total: number;
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

export function BudgetDisplay({budget}: {budget: Budget}) {
  return (
    <Link href={`/budget/${budget.id}`}>
      <div className="grid grid-cols-6 gap-4 bg-white hover:bg-gray-200 shadow-md rounded-lg p-4 m-5 divide-x divide-solid max-w-3xl">
        <div className="h-full items-center justify-center col-span-1">
          <span className="text-xl text-bold text-black justify-center h-full w-full p-2">
            {budget.event_name}
          </span>
        </div>
        <div className="col-span-2 grid grid-row-2 p-2">
          <BudgetStatusDisplay status={budget.current_status} />
          <div>
            <DateDisplay dateISO={budget.status_history[0]!.when} />
          </div>
        </div>
        <div className="col-span-2 p-2">
          <span className="text-lg text-black float-left">Cost: </span>
          <span className="text-lg text-black float-right text-bold">
            $ {budget.total_cost}
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
