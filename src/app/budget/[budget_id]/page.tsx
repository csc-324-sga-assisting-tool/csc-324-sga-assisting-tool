'use server';
import {BudgetView} from './budgetview';
import {DataModel, Database} from 'lib/data';

export default async function Page({params}: {params: {budget_id: string}}) {
  const db = Database;
  return (
    <BudgetView budget_id={params.budget_id} dataModel={new DataModel(db)} />
  );
}
