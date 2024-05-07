'use server';
import {DataModel, Item, Database, Comment} from 'lib/data';
import {revalidatePath} from 'next/cache';

export async function TESTtoggleDenyItemAction(
  dataModel: DataModel,
  item: Item
) {
  await dataModel.changeItemStatus(
    item,
    item.current_status === 'denied' ? 'created' : 'denied'
  );
}
export async function toggleDenyItemAction(item: Item) {
  await TESTtoggleDenyItemAction(new DataModel(Database), item);
  revalidatePath(`/budget/${item.budget_id}`);
}

// Only the actions that the user can perform should be included
// I.e. RSO should not be able to deny an item
export type ItemRowActions = {
  toggleDeny?: (item: Item) => Promise<void>;
  edit?: (item: Item) => Promise<void>;
  delete?: (item: Item) => Promise<void>;
  comment: (item: Item, comment: Comment) => Promise<void>;
};
