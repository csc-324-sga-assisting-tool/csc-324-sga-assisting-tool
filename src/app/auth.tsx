'use server';

import { User, DataModel, UserType, Database } from 'lib/data';
import { createSession, deleteSession } from './session';
import { redirect } from 'next/navigation';
import { normalizeID } from 'lib/util';

function createUser(
  name: string,
  email: string,
  total_budget: number,
  user_type: UserType
): User {
  const id = email; // Do I want to change this?
  const user: User = {
    id,
    name,
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
  name: string,
  email: string,
  total_budget: number,
  user_type: UserType,
  password: string
): Promise<{ message: string } | void> {
  const emailNorm = normalizeID(email);
  const modifier = new DataModel(Database);
  const user = createUser(name, emailNorm, total_budget, user_type);
  try {
    await modifier.addUser(emailNorm, password, user);
    await createSession(user.id);
  } catch (error) {
    return {
      message: error!.toString()
    };
  }
  redirect('/dashboard');
}

export async function signOutAction(): Promise<{ message: string } | void> {
  const modifier = new DataModel(Database);
  try {
    modifier.signOutUser();
    deleteSession();
  } catch (error) {
    return {
      message: 'sign out failed'
    };
  }
  redirect('/');
}

export async function signInAction(email: string, password: string): Promise<{ message: string } | void> {
  const emailNorm = normalizeID(email);
  const modifier = new DataModel(Database);
  try {
    await modifier.signInUser(emailNorm, password);
    await createSession(emailNorm);
  } catch (error) {
    return {
      message: error!.toString(),
    };
  }
  redirect('/dashboard');
}
