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

export async function deterUserType(email: string): Promise<UserType> {
  switch (true) {
    case /.*?sepc.*?@grinnell\.edu/gim.test(email):
      return 'SEPC';
    case /.*?@studentorg\.grinnell\.edu/gim.test(email):
      return 'RSO';
    case /sgatreasurer@grinnell\.edu/gim.test(email):
      return 'SGA_Treasurer';
    case /sgaat@grinnell\.edu/gim.test(email):
      return 'SGA_Assistant_Treasurer';
    default:
      Promise.reject(
        new Error('email does not satisfy RSO/SEPC/SGA user type')
      );
  }
  return 'RSO';
}

export async function createUserAction(
  name: string,
  email: string,
  total_budget: number,
  password: string,
  TESTING_FLAG = false
): Promise<{message: string} | void> {
  const emailNorm = normalizeID(email);
  const auth = AuthModel;
  try {
    const user_type = await deterUserType(email);
    const user = createUser(name, emailNorm, total_budget, user_type);
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
    redirect('/');
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
