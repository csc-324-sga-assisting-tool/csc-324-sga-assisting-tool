'use server';

import {User, DataModel, UserType, Database} from 'lib/data';
import {createSession, deleteSession} from './session';
import {redirect} from 'next/navigation';
import {normalizeID} from 'lib/util';

function createUser(
  user_name: string,
  email: string,
  total_budget: number,
  user_type: UserType
): User {
  const id = email; // Do I want to change this?
  const user: User = {
    id,
    user_name,
    remaining_budget: total_budget,
    total_budget,
    user_type,
    pending_event: 0,
    planned_event: 0,
    completed_event: 0,
  };

  return user;
}

export async function createUserAction(
  user_name: string,
  email: string,
  total_budget: number,
  user_type: UserType,
  password: string
): Promise<void> {
  const emailNorm = normalizeID(email);
  const modifier = new DataModel(Database);
  const user = createUser(user_name, emailNorm, total_budget, user_type);
  await createSession(user.id);
  await modifier.addUser(emailNorm, password, user);
  redirect('/dashboard');
}

export async function signOutAction() {
  console.log('BYE!!!!');
  const modifier = new DataModel(Database);
  modifier.signOutUser();
  deleteSession();
  redirect('/');
}

export async function signInAction(email: string, password: string) {
  if (email === '' || password === '') {
    return Promise.reject(new Error('Entered empty password or email'));
  }
  const emailNorm = normalizeID(email);
  const modifier = new DataModel(Database);
  modifier.signInUser(emailNorm, password);
  await createSession(emailNorm);
  //need to add logic for failed logins
  console.log('WELCOME!!!');
  redirect('/dashboard');
}
