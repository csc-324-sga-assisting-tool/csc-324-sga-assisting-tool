'use server';
import {DataModel, Item, Database, Comment} from 'lib/data';
import {revalidatePath} from 'next/cache';

export async function TESTdenyItemAction(dataModel: DataModel, item: Item) {
  // TODO: Change item status to denied
  revalidatePath(`/budget/${item.budget_id}`);
}
export async function denyItemAction(item: Item) {
  await TESTdenyItemAction(new DataModel(Database), item);
}

export type ItemRowActions = {
  deny: (item: Item) => Promise<void>;
  edit: (item: Item) => Promise<void>;
  delete: (item: Item) => Promise<void>;
  comment: (item: Item, comment: Comment) => Promise<void>;
};
