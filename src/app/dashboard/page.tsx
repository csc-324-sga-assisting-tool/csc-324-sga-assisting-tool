import { FirebaseProvider } from "lib/data/data_loader.firebase";
import { BudgetDisplay } from "./budget";
import { SummaryProps, SummarySidebar } from "./sidebar";
import { Budget, DataProvider } from "lib/data"
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "lib/firebase";
import { Collection } from "lib/firebase/config";



async function Dashboard({ userID, dataProvider }: { userID: string, dataProvider: DataProvider }) {
  // FIX: Calculate summary stuff using data
  const summaryProps: SummaryProps = {
    total: 1000,
    remaining: 400,
    pendingEvents: 5,
    plannedEvents: 10,
    completedEvents: 10
  }
  // await dataProvider.addBudgetId("test_budget_1", dataProvider.makeBudget(
  //   userID, "test_budget_1", "dance party" ,"Fun dance party", 1000, []
  // ))

  const userBudgets = await dataProvider.getUserBudgets(userID);
  console.log(userBudgets)
  return (
    <>
      <SummarySidebar {...summaryProps} />
      <main className="w-128">
        {
          userBudgets.map((budget: Budget) =>
            <BudgetDisplay
              key={budget.budget_id}
              title={budget.event_name}
              description={budget.event_description}
              total={budget.total_cost}
              status={budget.current_status}
              lastStatusDate={budget.status_history[0]!.when}
            />
          )
        }
      </main>
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
