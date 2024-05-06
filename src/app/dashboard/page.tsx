'use server';
import {Dashboard} from './dashboard';
import {DataModel, Database} from 'lib/data';
import {SGADashboard} from './sgaDashboard';
import {userIsSGA} from 'lib/data/utils';
import {revalidatePath} from 'next/cache';
import {AuthModel} from 'lib/data/auth_model';
import {redirect} from 'next/navigation';

export default async function Page() {
  revalidatePath('/dashboard');
  const db = Database;
  const dataModel = new DataModel(db);
  const auth = AuthModel;

  try {
    const userId = await auth.getSignedInUser();
    const user = await dataModel.getUser(userId);
    const isSGA = userIsSGA(user);
    return isSGA ? (
      <SGADashboard user={user} dataModel={dataModel} />
    ) : (
      <Dashboard user={user} dataModel={dataModel} />
    );
  } catch (error) {
    console.log(error!.toString());
    redirect('/');
  }
}
