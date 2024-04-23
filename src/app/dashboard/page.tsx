'use server';
import {Dashboard} from './dashboard';
import {DataModel, Database} from 'lib/data';

export default async function Page() {
  const db = Database;
  return <Dashboard userID="test_user" dataModel={new DataModel(db)} />;
}
