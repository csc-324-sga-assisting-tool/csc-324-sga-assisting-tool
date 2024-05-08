import {BudgetList} from './budget';
import {RSODashboardSidebar} from './sidebar';
import {DataModel, User} from 'lib/data';
import {NewBudgetForm} from './create_budget_form';
import {
  createBudgetAction,
  duplicateBudgetAction,
  TESTcreateBudgetAction,
  TESTduplicateBudgetAction,
} from './actions';

export async function Dashboard({
  user,
  dataModel: dataModel,
  TESTING_FLAG = false,
}: {
  user: User;
  dataModel: DataModel;
  TESTING_FLAG?: boolean;
}) {
  const budgets = await dataModel.getBudgetsForUser(user.id);
  // THIS IS BAD Code
  // The problem is that we can only pass data, not functions from server side to client side components
  // UNLESS those functions are 'server side actions'. As far as I know, the underlying firebase sdk probably
  // does not user server side functions so we need to decide the function at BUILD time meaning it can't be dynamic
  // So the createBudgetAction has Firebase fixed however, the TEST one allows us to set the dataModifier dynamically
  // at Runtime
  let action, updateAction;
  if (TESTING_FLAG) {
    action = TESTcreateBudgetAction.bind(null, dataModel);
    updateAction = TESTduplicateBudgetAction.bind(null, dataModel);
  } else {
    action = createBudgetAction;
    updateAction = duplicateBudgetAction;
  }

  return (
    <>
      <RSODashboardSidebar user={user} />

      <main className="w-128">
        <BudgetList
          budgets={budgets}
          show_organizer={false}
          updateAction={updateAction}
        />
      </main>

      <NewBudgetForm
        user_id={user.id}
        user_name={user.name}
        createBudgetAction={action}
      />
    </>
  );
}
