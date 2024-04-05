import { FirebaseProvider } from "lib/data/data_loader.firebase";
import { BudgetDisplay } from "./budget";
import { SummaryProps, SummarySidebar } from "./sidebar";
import { Budget, DataProvider } from "lib/data"
import { ComponentPlus  } from "./plus";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "lib/firebase";
import { Collection } from "lib/firebase/config";


import { Alert } from "flowbite-react";
//Figure out hope/making budget from client side
// async function SubmitedBud({ userID, dataProvider }: { userID: string, dataProvider: DataProvider }) {
//   // const editBud: Budget =
//   // {
//   //   user_id: userID,
//   //   budget_id: budgetNew.budget_id,
//   //   event_name: budgetNew.event_name,
//   //   event_description: budgetNew.event_description,
//   //   total_cost: budgetNew.total_cost,
//   //   current_status: budgetNew.current_status,
//   //   status_history: budgetNew.status_history,
//   //   items: budgetNew.items,

//   // }
//   // await dataProvider.addBudgetId(editBud.budget_id, editBud)
//   return (
//     <Alert color="info">
//       {/* <span className="font-medium">Submited!</span> `${editBud.budget_id}` */}
//     </Alert>
//   );
// }


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
      <ComponentPlus />
      

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
