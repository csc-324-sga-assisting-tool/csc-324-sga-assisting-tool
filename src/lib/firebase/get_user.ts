// Added
import {
  doc,
  Firestore,
  getDoc,
  getDocs,
  limit,
  where,
} from 'firebase/firestore';
import {User} from 'lib/data';
import {Collection} from './config';

async function getUserFirebase(
  user_id: string,
  db: Firestore
): Promise<User | undefined> {
  const result = await getDoc(doc(db, Collection.Users, `${user_id}`));
  const user: User = result.data() as User;
  return user;
}

export {getUserFirebase};
