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


export function BudgetDisplay(props: BudgetProps) {
  return (
    <div className="w-1/2 grid grid-row-5 p-6 justify-center gap-4">
      <div className="row-span-1">
        <BudgetStatusDisplay status={props.status} />
      </div>
      <div className="row-span-2">
        <p className="text-sm dark:text-gray-100 text-gray-800">{props.lastStatusDate}</p>
        <p className="text-lg text-slate-800 dark:text-blue-500">$ {props.total}</p>
      </div>
    </div>
  );
}

