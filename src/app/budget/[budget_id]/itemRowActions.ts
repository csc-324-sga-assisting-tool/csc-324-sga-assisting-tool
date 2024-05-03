'use server';
import {DataModel, Item, Database, Comment} from 'lib/data';
import {revalidatePath} from 'next/cache';

export async function TESTtoggleDenyItemAction(
  dataModel: DataModel,
  item: Item
) {
  dataModel.changeItemStatus(
    item,
    item.current_status === 'denied' ? 'created' : 'denied'
  );
  revalidatePath(`/budget/${item.budget_id}`);
}
export async function toggleDenyItemAction(item: Item) {
  await TESTtoggleDenyItemAction(new DataModel(Database), item);
}

export type ItemRowActions = {
  toggleDeny: (item: Item) => Promise<void>;
  edit: (item: Item) => Promise<void>;
  delete: (item: Item) => Promise<void>;
  comment: (item: Item, comment: Comment) => Promise<void>;
};
