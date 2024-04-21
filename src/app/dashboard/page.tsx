'use server';
import {verifySession} from 'app/dal';
import {Dashboard} from './dashboard';
import {DataModel, Database} from 'lib/data';

export default async function Page({
  params,
  searchParams,
}: {
  params: {slug: string};
  searchParams: {[key: string]: string | string[] | undefined};
}) {
  const session = await verifySession();
  const userId = session.userId;
  // if signed in as Tre do check adn use that one
  const db = Database;
  return <Dashboard userID={userId} dataModel={new DataModel(db)} />;
}
