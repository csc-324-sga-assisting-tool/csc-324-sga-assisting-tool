'use server';
import {
  FirebaseModifier,
  FirebaseProvider,
} from 'lib/data/data_loader.firebase';
import {Dashboard} from './dashboard';

export default async function Page({
  params,
  searchParams,
}: {
  params: {slug: string};
  searchParams: {[key: string]: string | string[] | undefined};
}) {
  return (
    <Dashboard
      userID="test_user"
      dataProvider={FirebaseProvider}
      dataModifier={FirebaseModifier}
    />
  );
}
