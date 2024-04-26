'use server';
import {RSOBudgetView} from './budgetview';
import {DataModel, Database} from 'lib/data';
import {verifySession} from 'app/dal';
import {userIsSGA} from 'lib/data/utils';

export default async function Page({params}: {params: {budget_id: string}}) {
  const db = Database;
  const dataModel = new DataModel(db);

  const session = await verifySession();
  const userId = session.userId;
  const user = await dataModel.getUser(userId);
  const isSGA = userIsSGA(user);
  return isSGA ? (
    <RSOBudgetView budget_id={params.budget_id} dataModel={dataModel} />
  ) : (
    <RSOBudgetView budget_id={params.budget_id} dataModel={dataModel} />
  );
}
