'use client';

import {Alert, Button, Checkbox, Label, TextInput} from 'flowbite-react';
import {SignUp} from './signUp';
import {signInAction} from './auth';
import {FormEvent, FormEventHandler, useState} from 'react';
import {IAuthModel} from 'lib/data/auth_model';
import {DataModel} from 'lib/data';

export function LogIn({
  TESTING_FLAG,
  TEST_AUTH,
  TEST_MODEL,
}: {
  TESTING_FLAG?: boolean;
  TEST_AUTH?: IAuthModel;
  TEST_MODEL?: DataModel;
}) {
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errorMessage, setError] = useState('');
  const submit: FormEventHandler<HTMLFormElement> = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const email = (
      e.currentTarget.elements.namedItem('email') as HTMLInputElement
    ).value;

    const password = (
      e.currentTarget.elements.namedItem('password') as HTMLInputElement
    ).value;

    let result;
    if (TESTING_FLAG) {
      result = await signInAction(email, password, TESTING_FLAG, TEST_AUTH);
    } else {
      result = await signInAction(email, password);
    }
    if (result) {
      setShowErrorAlert(true);
      setError(result.message);
    } else {
      setShowSuccessAlert(true);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen p-8">
      <form
        data-testid="login-form"
        className="bg-white w-1/3 h-60 gap-4 p-4 "
        onSubmit={submit}
      >
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1" value="Your email" />
          </div>
          <TextInput
            id="email"
            data-testid="login-form-email"
            type="email"
            placeholder="name@grinnell.edu"
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1" value="Your password" />
          </div>
          <TextInput
            id="password"
            type="password"
            data-testid="login-form-password"
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember">Remember me</Label>
        </div>
        <Button
          type="submit"
          data-testid="login-form-submit"
          className="bg-pallete-5 font-medium text-sm w-28 h-10"
        >
          Log In
        </Button>
      </form>
      <SignUp
        TESTING_FLAG={TESTING_FLAG}
        TEST_AUTH={TEST_AUTH}
        TEST_MODEL={TEST_MODEL}
      />
      {showErrorAlert && (
        <Alert
          className="max-w-md"
          color="failure"
          onDismiss={() => setShowErrorAlert(false)}
        >
          {' '}
          Sign In Failed: {errorMessage}{' '}
        </Alert>
      )}
      {showSuccessAlert && (
        <Alert
          className="max-w-md"
          color="success"
          onDismiss={() => setShowSuccessAlert(false)}
        >
          {' '}
          Success{' '}
        </Alert>
      )}
    </div>
  );
}
