'use server';
import {SGABudgetViewSidebar} from './sidebar';
import {Item, Budget, DataModel, Comment} from 'lib/data';
import * as review from './review_actions';
import {ItemDisplay} from './itemDisplay';
import {
  TESTdenyItemAction,
  denyItemAction,
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
  let addEventCmnt, deleteEventCmnt, getPreviousCmnts;
  const itemRowActions: ItemRowActions = {
    deny: denyItemAction,
    edit: async () => {},
    delete: async () => {},
    comment: async () => {},
  };
  if (TESTING_FLAG) {
    approveAction = review.TESTapproveBudgetAction.bind(null, dataModel);
    denyAction = review.TESTdenyBudgetAction.bind(null, dataModel);
    clearAction = review.TESTclearCommentsAction.bind(null, dataModel);
    addEventCmnt = review.TESTaddEventCommentAction.bind(null, dataModel);
    deleteEventCmnt = review.TESTdeleteEventCommentAction.bind(null, dataModel);
    getPreviousCmnts = review.TESTgetPreviousEventCommentsAction.bind(
      null,
      dataModel
    );
    itemRowActions.deny = TESTdenyItemAction.bind(null, dataModel);
  } else {
    approveAction = review.approveBudgetAction;
    denyAction = review.denyBudgetAction;
    clearAction = review.clearCommentsAction;
    addEventCmnt = review.addEventCommentAction;
    deleteEventCmnt = review.deleteEventCommentAction;
    getPreviousCmnts = review.getPreviousEventCommentsAction;
    itemRowActions.deny = denyItemAction;
  }

  let eventComment: Comment;
  if (budget.commentID === '') eventComment = createComment({userId: user_id});
  else eventComment = await dataModel.getComment(budget.commentID);

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
        <EventCommentThread
          budget={budget}
          eventCommentThreadController={{
            addEventComment: addEventCmnt,
            deleteEventComment: deleteEventCmnt,
            getPreviousComments: getPreviousCmnts,
            comment: eventComment,
          }}
        />
        <ItemDisplay items={items} itemRowActions={itemRowActions} />
      </main>
    </>
  );
}
