'use client';

import {Status, Budget} from 'lib/data';
import {Color} from 'lib/color.types';
import {FiCopy, FiEdit, FiTrash2} from 'react-icons/fi';
import Link from 'next/link';
import {HiPlusCircle} from 'react-icons/hi';
import {Button} from 'flowbite-react';
import {duplicateBudgetAction} from './actions';

export type BudgetProps = {
  budget: Budget;
  organizer?: string;
  updateAction: (budget: Budget) => Promise<void>;
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
  const budget: Budget = props.budget;
  return (
    <Link href={`/budget/${budget.id}`}>
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
            {budget.event_name}
          </span>
        </div>
        <div className="col-span-3 grid grid-row-2 p-2">
          <BudgetStatusDisplay status={budget.current_status} />
          <div>
            <DateDisplay dateISO={budget.status_history[0]!.when} />
          </div>
        </div>
        <div className="col-span-3 p-2">
          <span className="text-lg text-black float-left">Cost: </span>
          <span className="text-lg text-black float-right text-bold">
            $ {budget.total_cost}
          </span>
        </div>
        <div className="col-span-1 items-center">
          <DuplicateBudgetButton
            updateAction={props.updateAction}
            budget={budget}
          />
        </div>
        <div className="col-span-1 items-center">
          <DeleteBudgetButton budget={budget} />
        </div>
      </div>
    </Link>
  );
}

function DuplicateBudgetButton({
  budget,
  updateAction,
}: {
  budget: Budget;
  updateAction: (budget: Budget) => Promise<void>;
}) {
  return (
    <Button
      data-testid="budget-view-duplicate-budget"
      onClick={() => updateAction(budget)}
    >
      <FiCopy className="text-pallete-4 hover:text-pallete-5" />
    </Button>
  );
}
// Add onClick={() => deleteBudgetAction(budget)} once implemented
function DeleteBudgetButton({budget}: {budget: Budget}) {
  return (
    <Button
      data-testid="budget-view-delete-budget"
      className="text-palette-4 hover:text-palette-5"
    >
      <FiTrash2 />
    </Button>
  );
}
export function BudgetList(props: {
  budgets: Budget[];
  show_organizer: boolean;
  updateAction: (budget: Budget) => Promise<void>;
}) {
  return (
    <>
      {props.budgets.map((budget: Budget) => (
        <BudgetDisplay
          key={budget.id}
          budget={budget}
          organizer={props.show_organizer ? budget.user_name : undefined}
          updateAction={props.updateAction}
        />
      ))}
    </>
  );
}
