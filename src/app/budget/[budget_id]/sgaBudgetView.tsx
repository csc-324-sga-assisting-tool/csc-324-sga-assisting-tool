'use server';
import {SGABudgetViewSidebar} from './sidebar';
import {Item, Budget, DataModel} from 'lib/data';
import {
  approveBudgetAction,
  denyBudgetAction,
  clearCommentsAction,
  TESTapproveBudgetAction,
  TESTdenyBudgetAction,
  TESTclearCommentsAction,
} from './review_actions';
import {ItemDisplay} from './itemDisplay';

export async function SGABudgetView({
  budget_id,
  dataModel: dataModel,
  TESTING_FLAG = false,
}: {
  budget_id: string;
  dataModel: DataModel;
  TESTING_FLAG?: boolean;
}) {
  const budget = (await dataModel.getBudget(budget_id)) as Budget;
  // TODO: get items from db
  const items: Item[] = await dataModel.getItemsForBudget(budget_id);
  // THIS IS BAD Code
  // The problem is that we can only pass data, not functions from server side to client side components
  // UNLESS those functions are 'server side actions'. As far as I know, the underlying firebase sdk probably
  // does not user server side functions so we need to decide the function at BUILD time meaning it can't be dynamic
  // So the createBudgetAction has Firebase fixed however, the TEST one allows us to set the dataModifier dynamically
  // at Runtime
  let approveAction, denyAction, clearAction;
  if (TESTING_FLAG) {
    approveAction = TESTapproveBudgetAction.bind(null, dataModel);
    denyAction = TESTdenyBudgetAction.bind(null, dataModel);
    clearAction = TESTclearCommentsAction.bind(null, dataModel);
  } else {
    approveAction = approveBudgetAction;
    denyAction = denyBudgetAction;
    clearAction = clearCommentsAction;
  }
  return (
    <>
      <SGABudgetViewSidebar
        budget={budget}
        item_count={items.length}
        reviewActionController={{
          approveBudget: approveAction,
          denyBudget: denyAction,
          clearComments: clearAction,
        }}
      />
      <main className="ml-72 w-3/5 bg-white">
        <ItemDisplay items={items} />
      </main>
    </>
  );
}
