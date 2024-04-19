'use server';
import {Dashboard} from './dashboard';
import {DataModel, Database} from 'lib/data';

export default async function Page({
  params,
  searchParams,
}: {
  params: {slug: string};
  searchParams: {[key: string]: string | string[] | undefined};
}) {
  // const router = useRouter()
  // const {
  //   query: {name}
  // } = router
  // console.log(name)
  const db = Database;
  return <Dashboard userID="test_user" dataModel={new DataModel(db)} />;
}
