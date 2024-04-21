'use server';
// import {revalidatePath} from 'next/cache';
import {User, DataModel, UserType, Database} from 'lib/data';
import {createSession, deleteSession} from './session';
import {redirect} from 'next/navigation';
import { revalidatePath } from 'next/cache';

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
):  Promise<string | void> {
  const modifier = new DataModel(Database);
  const user = createUser(user_name, email, total_budget, user_type);
  // 4. Create user session
  await createSession(user.id);
  const out =  modifier.addUser(email, password, user);
  const work = await out.then()
  if (typeof work === "string" ){
    return work
  }
  revalidatePath('/dashboard');
  redirect('/dashboard')
  // User the router to move to dashboard 
  // when error/string in promise return the string out else use redirect to proceed
}

export async function signOutAction(){
  console.log("BYE!!!!")
  const modifier = new DataModel(Database);
  modifier.signOutUser();
  deleteSession()
  redirect('/')
}

export async function signInAction(email: string, password: string){
  const modifier = new DataModel(Database);
  modifier.signInUser(email, password);
  await createSession(email);//since user.id is the email for now
  console.log("WELCOME!!!")
  revalidatePath('/dashboard');
  redirect('/dashboard')
}