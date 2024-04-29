import {DataModel, Document, User} from 'lib/data';
import {beforeEach, beforeAll, describe, expect, test, assert} from 'vitest';
import {
  clearCollection,
  getLocalAuth,
  getLocalFirebase,
} from '../../utils/database.util';
import {Filter, Sort} from 'lib/data/database';
import {LocalDatabase} from '../../utils/database.local';
import {Collections} from 'lib/firebase';
import {getFirestore} from 'firebase/firestore';
import {deleteUser, getAuth} from 'firebase/auth';
import {FirestoreAuthModel} from 'lib/data/auth_model.firebase';

const testCollection = Collections.Users;
// const database = new LocalDatabase();
const db = getFirestore();
const database = getLocalFirebase(db);
const dataModel = new DataModel(database);

const auth = getLocalAuth();
const authModel = new FirestoreAuthModel(auth);

const testUsers: User[] = [1, 2, 3].map(number => {
  return {
    id: `test_user${number * 2}@grinnell.edu`,
    name: `test_user${number * 2}`,
    total_budget: 2000,
    remaining_budget: 1000,
    pending_event: 5,
    completed_event: 10,
    planned_event: 5,
    user_type: 'RSO',
  };
});

function generateTestPassword(user: User) {
  const password = `${user.id} + ${Math.floor(
    Math.random() * user.total_budget
  )}`;
  return password;
}

const passwords: string[] = testUsers.map(user => {
  return generateTestPassword(user);
});

beforeEach(async () => {
  await clearCollection(database, testCollection);
});

describe('Test FirestoreAuthModel class', async () => {
  test('creating user in firebase and database', async () => {
    await authModel.createUser(
      testUsers[0].id,
      passwords[0],
      testUsers[0],
      dataModel
    );

    const user1 = await dataModel.getUser(testUsers[0].id);

    assert.equal(user1!.id, testUsers[0].id);
    expect(user1).toEqual(testUsers[0]);
  });

  test('Sign in to firebase', async () => {
    await authModel.createUser(
      testUsers[1].id,
      passwords[1],
      testUsers[1],
      dataModel
    );
    await authModel.signIn(testUsers[1].id, passwords[1]);
    const userId = await authModel.getSignedInUser();

    assert.equal(userId, testUsers[1].id);
  });

  test('Sign out to firebase', async () => {
    await authModel.createUser(
      testUsers[2].id,
      passwords[2],
      testUsers[2],
      dataModel
    );
    await authModel.signIn(testUsers[2].id, passwords[2]);
    await authModel.signOut();
    await expect(
      async () => await authModel.getSignedInUser()
    ).rejects.toThrowError();
  });
});
