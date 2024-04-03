import { Status } from "lib/data";
import { Color } from "lib/color.types";


export type BudgetProps = {
  title: string
  description: string
  status: Status
  lastStatusDate: string
  total: number
}

function BudgetStatusDisplay({ status }: { status: Status }) {
  let color: Color = "gray"
  let text: String = "Saved"
  switch (status) {
    case "submitted":
      color = "yellow";
      text = "Pending";
      break;
    case "created":
      color = "gray";
      text = "Saved";
      break;
    case "approved":
      color = "green";
      text = "Approved";
      break;
    case "denied":
      color = "red";
      text = "Denied";
      break;
  }
  return (
    <span className={`px-2 w-fit items-center justify-center text-sm font-medium text-${color}-800 bg-${color}-100 rounded-full dark:bg-${color}-700 dark:text-${color}-500`}>{text}</span>
  );

}

function DateDisplay({ dateISO }: { dateISO: string }) {
  const date = new Date(dateISO);
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();
  return (
    <div>
      <p className="text-sm dark:text-gray-100 text-gray-800">{day} {month}, {year}</p>
      <p className="text-sm dark:text-gray-100 text-gray-800">{dateISO}</p>
    </div>
  )
}


export function BudgetDisplay(props: BudgetProps) {
  return (
    <div className="flex ml-72 my-5 bg-gray-500 rounded w-1/2 p-6 gap-4">
      <div>
        <BudgetStatusDisplay status={props.status} />
        <DateDisplay dateISO={props.lastStatusDate} />
      </div>
      <div>
        <p className="text-lg text-slate-800 dark:text-blue-500">$ {props.total}</p>
      </div>
    </div>
  );
}

