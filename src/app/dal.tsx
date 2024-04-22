import 'server-only';

import {cookies} from 'next/headers';
import {decrypt} from './session';
import {cache} from 'react';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';

export const verifySession = cache(async () => {
  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);

  if (session === undefined) {
    redirect('/');
    // router.push()
  }
  revalidatePath('/dashboard');

  return {isAuth: true, userId: session.userId as string};
});
