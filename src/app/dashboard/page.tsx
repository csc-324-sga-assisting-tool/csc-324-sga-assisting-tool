'use server';
import {verifySession} from 'app/dal';
import {Dashboard} from './dashboard';
import {DataModel, Database} from 'lib/data';
import {revalidatePath} from 'next/cache';

export default async function Page() {
  revalidatePath('/dashboard');
  const session = await verifySession();
  const userId = session.userId;
  console.log(`User id from session is: ${userId}`);
  // if signed in as Tre do check adn use that one
  const db = Database;
  return <Dashboard userID={userId} dataModel={new DataModel(db)} />;
}
