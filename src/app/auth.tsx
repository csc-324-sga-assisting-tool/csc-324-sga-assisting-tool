'use server';
// import {revalidatePath} from 'next/cache';
import {User, DataModel, UserType, Database} from 'lib/data';

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
    remaining_budget: 0,
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
): Promise<void | string> {
  const modifier = new DataModel(Database);
  const user = createUser(user_name, email, total_budget, user_type);
  return modifier.addUser(email, password, user);
}
