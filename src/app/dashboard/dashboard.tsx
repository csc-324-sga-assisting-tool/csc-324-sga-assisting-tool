import {BudgetDisplay} from './budget';
import {DashboardSidebar} from './sidebar';
import {Budget, DataModel, User} from 'lib/data';
import {NewBudgetForm} from './create_budget_form';
import {createBudgetAction, TESTcreateBudgetAction} from './actions';

export async function Dashboard({
  userID,
  dataModel: dataModel,
  TESTING_FLAG = false,
}: {
  userID: string;
  dataModel: DataModel;
  TESTING_FLAG?: boolean;
}) {
  const user = (await dataModel.getUser(userID)) as User;
  const userBudgets = await dataModel.getBudgetsForUser(userID);
  // THIS IS BAD Code
  // The problem is that we can only pass data, not functions from server side to client side components
  // UNLESS those functions are 'server side actions'. As far as I know, the underlying firebase sdk probably
  // does not user server side functions so we need to decide the function at BUILD time meaning it can't be dynamic
  // So the createBudgetAction has Firebase fixed however, the TEST one allows us to set the dataModifier dynamically
  // at Runtime
  let action;
  if (TESTING_FLAG) {
    action = TESTcreateBudgetAction.bind(null, dataModel);
  } else {
    action = createBudgetAction;
  }

  return (
    <>
      <DashboardSidebar {...user} />
      <main className="w-128">
        {userBudgets.map((budget: Budget) => (
          <BudgetDisplay
            key={budget.id}
            title={budget.event_name}
            description={budget.event_description}
            total={budget.total_cost}
            status={budget.current_status}
            lastStatusDate={budget.status_history[0]!.when}
          />
        ))}
      </main>
      <NewBudgetForm user_id={userID} createBudgetAction={action} />
    </>
  );
}
