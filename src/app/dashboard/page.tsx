'use server';
import {Dashboard} from './dashboard';
import {DataModel, Database} from 'lib/data';
import {SGADashboard} from './sgaDashboard';
import {userIsSGA} from 'lib/data/utils';

export default async function Page({
  params,
  searchParams,
}: {
  params: {slug: string};
  searchParams: {[key: string]: string | string[] | undefined};
}) {
  const db = Database;
  const dataModel = new DataModel(db);
  const user = await dataModel.getUser('test_user');
  const isSGA = userIsSGA(user);

  return isSGA ? (
    <SGADashboard user={user} dataModel={dataModel} />
  ) : (
    <Dashboard user={user} dataModel={dataModel} />
  );
}
