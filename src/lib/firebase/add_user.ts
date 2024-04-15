import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {User} from 'lib/data';
import {doc, setDoc, Firestore} from 'firebase/firestore';
import {Collection} from './config';

const auth = getAuth();

export async function addUserFirebase(
  email: string,
  password: string,
  user: User,
  db: Firestore
): Promise<void> {
  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      // Signed up
      const user = userCredential.user;

      // ...
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });

  return await setDoc(doc(db, Collection.Users, `${user.user_id}`), user);
}
