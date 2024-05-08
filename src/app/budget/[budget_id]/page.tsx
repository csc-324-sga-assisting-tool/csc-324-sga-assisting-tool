'use server';
import {ComponentNav} from 'app/navbarComp';
import {RSOBudgetView} from './budgetview';
import {SGABudgetView} from './sgaBudgetView';
import {DataModel, Database} from 'lib/data';
import {userIsSGA} from 'lib/data/utils';
import {AuthModel} from 'lib/data/auth_model';
import {redirect} from 'next/navigation';

export default async function Page({params}: {params: {budget_id: string}}) {
  const db = Database;

  const dataModel = new DataModel(db);
  const auth = AuthModel;

  try {
    const userId = await auth.getSignedInUser();
    const user = await dataModel.getUser(userId);
    const isSGA = userIsSGA(user);
    return isSGA ? (
      <>
        <ComponentNav buttonLabel={'Log Out'} />
        <SGABudgetView
          budget_id={params.budget_id}
          user_id={userId}
          dataModel={dataModel}
        />
      </>
    ) : (
      <>
        <ComponentNav buttonLabel={'Log Out'} />
        <RSOBudgetView budget_id={params.budget_id} dataModel={dataModel} />
      </>
    );
  } catch (error) {
    console.log(error!.toString());
    redirect('/');
  }
}
