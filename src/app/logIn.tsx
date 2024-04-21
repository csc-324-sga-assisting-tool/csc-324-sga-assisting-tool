'use client';

import {Button, Checkbox, Label, TextInput} from 'flowbite-react';
import {SignUp} from './createAcc';
import { signInAction } from './auth';
import { FormEvent, FormEventHandler } from 'react';

export function ComponentLog() {

  const submit: FormEventHandler<HTMLFormElement> = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const email = (
      e.currentTarget.elements.namedItem('email') as HTMLInputElement
    ).value;

    const password = (
      e.currentTarget.elements.namedItem('password') as HTMLInputElement
    ).value;


    const output = signInAction(email, password);
    // will use out if error occured else redirect before here
  };

  return (
    <div className="block  place-self-center">
      <form className="bg-white flex max-w-lg flex-col gap-4  justify-items-center justify-self-center" onSubmit={submit}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1" value="Your email" />
          </div>
          <TextInput
            id="email"
            type="email"
            placeholder="name@grinnell.edu"
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1" value="Your password" />
          </div>
          <TextInput id="password" type="password" required />
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
        <SignUp />
      </form>
    </div>
  );
}
