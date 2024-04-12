import {FirebaseProvider} from 'lib/data/data_loader.firebase';
import {BudgetDisplay} from './budget';
import {SummarySidebar} from './sidebar';
import {Budget, DataProvider, User} from 'lib/data';
import {NewBudgetForm} from './create_budget_form';

async function Dashboard({
  userID,
  dataProvider,
}: {
  userID: string;
  dataProvider: DataProvider;
}) {
  const user = (await dataProvider.getUser(userID)) as User; // Added
  const userBudgets = await dataProvider.getUserBudgets(userID);

  return (
    <>
      <SummarySidebar
        total={user.total_budget}
        remaining={user.remaining_budget}
        pendingEvents={user.pending_event}
        plannedEvents={user.planned_event}
        completedEvents={user.completed_event}
      />
      <main className="w-128">
        {userBudgets.map((budget: Budget) => (
          <BudgetDisplay
            key={budget.budget_id}
            title={budget.event_name}
            description={budget.event_description}
            total={budget.total_cost}
            status={budget.current_status}
            lastStatusDate={budget.status_history[0]!.when}
          />
        ))}
      </main>
      <NewBudgetForm user_id={userID} />
    </>
  );
}

export default async function Page({
  params,
  searchParams,
}: {
  params: {slug: string};
  searchParams: {[key: string]: string | string[] | undefined};
}) {
  return <Dashboard userID="test_user" dataProvider={FirebaseProvider} />;
}
