import { BudgetViewSidebar } from './sidebar';
import { Item, Budget, DataModel } from 'lib/data';
import { updateBudgetAction, TESTupdateBudgetAction, TESTcreateItemAction, createItemAction } from './actions';
import { ItemDisplay } from './itemDisplay';
import { NewItemForm } from './addItemForm';

export async function BudgetView({
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
  //const items = await dataModel.getItemsForBudget(budget_id);
  const items: Item[] = [
    {
      budget_id,
      id: 'test-item',
      name: 'Test Item',
      quantity: 10,
      vendor: 'Walmart',
      unit_price: 5,
    },
    {
      budget_id,
      id: 'test-item-2',
      name: 'Second Test Item',
      quantity: 15,
      vendor: 'Amazon',
      unit_price: 10,
    },
    {
      budget_id,
      id: 'test-item-3',
      name: 'Test Item with Link',
      quantity: 15,
      vendor: 'Amazon',
      url: 'https://amazon.com',
      unit_price: 10,
    },
  ];

  // THIS IS BAD Code
  // The problem is that we can only pass data, not functions from server side to client side components
  // UNLESS those functions are 'server side actions'. As far as I know, the underlying firebase sdk probably
  // does not user server side functions so we need to decide the function at BUILD time meaning it can't be dynamic
  // So the createBudgetAction has Firebase fixed however, the TEST one allows us to set the dataModifier dynamically
  // at Runtime
  let updateAction, itemAddAction;
  if (TESTING_FLAG) {
    updateAction = TESTupdateBudgetAction.bind(null, dataModel);
    itemAddAction = TESTcreateItemAction.bind(null, dataModel);
  } else {
    updateAction = updateBudgetAction;
    itemAddAction = createItemAction;
  }
  return (
    <>
      <BudgetViewSidebar
        budget={budget}
        item_count={items.length}
        updateBudgetAction={updateAction}
      />
      <main className="ml-72 w-3/5 bg-white">
        <ItemDisplay items={items} />
        <NewItemForm budget_id={budget_id} createItemAction={itemAddAction} />
      </main>
    </>
  );
}
