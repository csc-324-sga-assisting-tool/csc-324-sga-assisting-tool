'use server';
import {verifySession} from 'app/dal';
import {Dashboard} from './dashboard';
import {DataModel, Database} from 'lib/data';
import {SGADashboard} from './sgaDashboard';
import {userIsSGA} from 'lib/data/utils';
import {revalidatePath} from 'next/cache';

export default async function Page() {
  revalidatePath('/dashboard');
  const db = Database;
  const dataModel = new DataModel(db);

  const session = await verifySession();
  const userId = session.userId;
  const user = await dataModel.getUser(userId);
  const isSGA = userIsSGA(user);
  console.log(`User id from session is: ${userId}`);

  return isSGA ? (
    <SGADashboard user={user} dataModel={dataModel} />
  ) : (
    <Dashboard user={user} dataModel={dataModel} />
  );
}
