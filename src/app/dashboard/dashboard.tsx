import {BudgetDisplay} from './budget';
import {SummarySidebar} from './sidebar';
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
      <SummarySidebar
        total={user.total_budget}
        remaining={user.remaining_budget}
        pendingEvents={user.pending_event}
        plannedEvents={user.planned_event}
        completedEvents={user.completed_event}
      />
      <main className="w-128 ml-72">
        {userBudgets.map((budget: Budget) => (
          <BudgetDisplay key={budget.id} budget={budget} />
        ))}
      </main>
      <NewBudgetForm user_id={userID} createBudgetAction={action} />
    </>
  );
}
