import { FirebaseProvider } from "lib/data/data_loader.firebase";
import { BudgetDisplay } from "./budget";
import { SummaryProps, SummarySidebar } from "./sidebar";
import { Budget, DataProvider, getUserBudgets } from "lib/data"



async function Dashboard({ userID, dataProvider }: { userID: string, dataProvider: DataProvider }) {
  const summaryProps: SummaryProps = {
    total: 1000,
    remaining: 400,
    pendingEvents: 5,
    plannedEvents: 10,
    completedEvents: 10
  }

  const userBudgets = await dataProvider.getUserBudgets(userID);

  return (
    <>
      <SummarySidebar {...summaryProps} />
      <div className="w-128">
        {
          userBudgets.map((budget: Budget) => (
            <BudgetDisplay
              key={budget.budget_id}
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



export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {

  return <Dashboard userID="test_user" dataProvider={FirebaseProvider} />

}
