import { BudgetDisplay } from './budget';
import { DashboardSidebar } from './sidebar';
import { Budget, Filter, DataModel, User } from 'lib/data';

export async function SGADashboard({
  user,
  dataModel: dataModel,
  TESTING_FLAG = false,
}: {
  user: User;
  dataModel: DataModel;
  TESTING_FLAG?: boolean;
}) {
  const budgets = await dataModel.getBudgetsSubmitted();

  return (
    <>
      <DashboardSidebar {...user} />
      <main className="w-128">
        {budgets.map((budget: Budget) => (
          <BudgetDisplay
            key={budget.id}
            organizer={budget.user_name}
            title={budget.event_name}
            description={budget.event_description}
            total={budget.total_cost}
            status={budget.current_status}
            lastStatusDate={budget.status_history[0]!.when}
          />
        ))}
      </main>
    </>
  );
}
