'use server';
// import {revalidatePath} from 'next/cache';
import {User, DataModifier, FirebaseModifier} from 'lib/data';

export async function createUser(
  user_id: string,
  user_name: string,
  email: string,
  password: string,
  sepcBool: boolean,
  total_budget: number, 
): Promise<void> {
  const dataModifier: DataModifier = FirebaseModifier;
  // const budget_id = `${user_id}-${event_name}-${new Date().getSeconds()}`;
  const user: User = {
    user_id,
    email,
    password,
    is_SEPC: sepcBool,
    user_name,
    remaining_budget: total_budget,
    total_budget,
    user_type: "", //fix this later
    pending_event: 0,
    planned_event: 0,
    completed_event: 0,
  };

  // revalidatePath('/dashboard');
  return await dataModifier.addUser(user);
}
