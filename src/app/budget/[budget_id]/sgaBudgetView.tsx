'use server';
import {SGABudgetViewSidebar} from './sidebar';
import {Item, Budget, DataModel, Comment} from 'lib/data';
import * as review from './review_actions';
import {ItemDisplay} from './itemDisplay';
import {
  TESTtoggleDenyItemAction,
  toggleDenyItemAction,
  ItemRowActions,
} from './itemRowActions';
import {EventCommentThread} from './eventComments';
import {createComment} from 'lib/data/utils';

export async function SGABudgetView({
  budget_id,
  user_id,
  dataModel: dataModel,
  TESTING_FLAG = false,
}: {
  budget_id: string;
  user_id: string;
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
  const itemRowActions: ItemRowActions = {
    toggleDeny: toggleDenyItemAction,
    comment: async () => {
      'use server';
    },
  };
  if (TESTING_FLAG) {
    approveAction = review.TESTapproveBudgetAction.bind(null, dataModel);
    denyAction = review.TESTdenyBudgetAction.bind(null, dataModel);
    clearAction = review.TESTclearCommentsAction.bind(null, dataModel);
    itemRowActions.toggleDeny = TESTtoggleDenyItemAction.bind(null, dataModel);
  } else {
    approveAction = review.approveBudgetAction;
    denyAction = review.denyBudgetAction;
    clearAction = review.clearCommentsAction;
  }

  return (
    <>
      <SGABudgetViewSidebar
        budget={budget}
        items={items}
        reviewActionController={{
          approveBudget: approveAction,
          denyBudget: denyAction,
          clearComments: clearAction,
        }}
      />
      <main className="ml-72 w-3/5 mt-16 bg-white">
        <ItemDisplay
          items={items}
          budget={budget}
          sgaUser={true}
          itemRowActions={itemRowActions}
        />
      </main>
    </>
  );
}
