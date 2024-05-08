'use server';
import {Dashboard} from './dashboard';
import {DataModel, Database} from 'lib/data';
import {SGADashboard} from './sgaDashboard';
import {userIsSGA} from 'lib/data/utils';
import {revalidatePath} from 'next/cache';
import {AuthModel} from 'lib/data/auth_model';
import {redirect} from 'next/navigation';
import {ComponentNav} from 'app/navbarComp';

export default async function Page() {
  revalidatePath('/dashboard');
  const db = Database;
  const dataModel = new DataModel(db);
  const auth = AuthModel;

  try {
    const userId = await auth.getSignedInUser();
    const user = await dataModel.getUser(userId);
    const isSGA = userIsSGA(user);
    console.log(`User id from session is: ${user.id}`);
    return isSGA ? (
      <main className="bg-grey-500 dark:bg-slate-800">
        <ComponentNav buttonLabel={'Log Out'} />
        <SGADashboard user={user} dataModel={dataModel} />
      </main>
    ) : (
      <main className="bg-grey-500 dark:bg-slate-800">
        <ComponentNav buttonLabel={'Log Out'} />
        <Dashboard user={user} dataModel={dataModel} />
      </main>
    );
  } catch (error) {
    console.log(error!.toString());
    redirect('/');
  }
}
