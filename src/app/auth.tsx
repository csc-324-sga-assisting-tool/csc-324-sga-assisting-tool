'use server';
import {User, UserType} from 'lib/data';
import {redirect} from 'next/navigation';
import {normalizeID} from 'lib/util';
import {AuthModel} from 'lib/data/auth_model';

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
  password: string,
  TESTING_FLAG = false
): Promise<{message: string} | void> {
  const emailNorm = normalizeID(email);
  const auth = AuthModel;
  const user = createUser(name, emailNorm, total_budget, user_type);
  try {
    await auth.createUser(emailNorm, password, user);
  } catch (error) {
    return {
      message: error!.toString(),
    };
  }
  if (!TESTING_FLAG) {
    redirect('/dashboard');
  }
}

export async function signOutAction(
  TESTING_FLAG = false
): Promise<{message: string} | void> {
  const auth = AuthModel;
  try {
    auth.signOut();
  } catch (error) {
    return {
      message: 'sign out failed',
    };
  }
  if (!TESTING_FLAG) {
    redirect('/dashboard');
  }
}

export async function signInAction(
  email: string,
  password: string,
  TESTING_FLAG = false
): Promise<{message: string} | void> {
  const emailNorm = normalizeID(email);
  const auth = AuthModel;
  try {
    await auth.signIn(emailNorm, password);
  } catch (error) {
    return {
      message: error!.toString(),
    };
  }
  if (!TESTING_FLAG) {
    redirect('/dashboard');
  }
}
