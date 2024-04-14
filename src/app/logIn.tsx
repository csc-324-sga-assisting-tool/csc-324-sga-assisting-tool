'use client';

import {Button, Checkbox, Label, TextInput} from 'flowbite-react';
import { SignUp } from './createAcc';

export function ComponentLog() {
  return (
    <div className='block  place-self-center'>
    
    <form className="bg-white flex max-w-lg flex-col gap-4  justify-items-center justify-self-center">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email1" value="Your email" />
        </div>
        <TextInput
          id="email1"
          type="email"
          placeholder="name@flowbite.com"
          required
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password1" value="Your password" />
        </div>
        <TextInput id="password1" type="password" required />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember">Remember me</Label>
      </div>
      <Button
        type="submit"
        className="bg-pallete-5 font-medium text-sm w-28 h-10"
      >
        Log In
      </Button>
      <SignUp/>
    </form>
    
    </div>
  );
}
