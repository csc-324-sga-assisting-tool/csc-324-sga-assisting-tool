
import { BudgetDisplay, BudgetProps } from "./budget";
import { SummaryProps, SummarySidebar } from "./sidebar";
import { Budget, getUserBudgets } from "lib/data"




export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  //const dummyProps: BudgetProps = { title: "Cat Party", description: "lorem ipsum dolor", status: "created", lastStatusDate: "01/01/2001", total: 200 }
  const userBudgets = await getUserBudgets("test_user");
  const dummyUserSummary: SummaryProps = {
    total: 1000,
    remaining: 400,
    pendingEvents: 5,
    plannedEvents: 10,
    completedEvents: 10
  }
  return (
    <>
      <SummarySidebar {...dummyUserSummary} />
      <div className="w-128">
        {
          userBudgets.map((budget: Budget, index) => (
            <BudgetDisplay
              key={index}
              title={budget.event_name}
              description={budget.event_description}
              total={budget.total_cost}
              status={budget.current_status}
              lastStatusDate={budget.status_history[0]!.when}
            />
          )
          )
        }
      </div>
    </>
  );
}
