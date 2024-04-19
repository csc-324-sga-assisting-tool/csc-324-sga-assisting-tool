'use client';

import {
  Button,
  Label,
  Checkbox,
  Modal,
  TextInput,
  Select,
} from 'flowbite-react';
import {FormEvent, FormEventHandler, useState} from 'react';
import {createUserAction} from './auth';
import {UserType, UserTypes} from 'lib/data';
import {useRouter} from 'next/navigation';

export function SignUp() {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);

  const submit: FormEventHandler<HTMLFormElement> = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const name = (
      e.currentTarget.elements.namedItem('name') as HTMLInputElement
    ).value;
    const email = (
      e.currentTarget.elements.namedItem('email') as HTMLInputElement
    ).value;

    const password = (
      e.currentTarget.elements.namedItem('password') as HTMLInputElement
    ).value;

    const budget = (
      e.currentTarget.elements.namedItem('budget') as HTMLInputElement
    ).value as unknown as number;

    const userType = (
      e.currentTarget.elements.namedItem('user_type') as HTMLInputElement
    ).value as UserType;

    setOpenModal(false);

    const output = createUserAction(name, email, budget, userType, password);
    // <Link
    //   href={{
    //     pathname: '/dashboard',
    //     query: {
    //       userId: name
    //     }
    //   }}
    // ></Link>
    router.push('/dashboard');
  };

  return (
    <>
      <Button
        className="flex font-medium text-sm text-black underline-offset-auto "
        onClick={() => setOpenModal(true)}
      >
        Don `&apos;`t have an account? Sign up
      </Button>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header> Create a new Account </Modal.Header>
        <Modal.Body>
          <div className="bg-white">
            <form
              className="flex max-w-md flex-col gap-4 bg-white"
              onSubmit={submit}
            >
              <div>
                <div className="m-2 block">
                  <Label htmlFor="name" value="Your RSO name" />
                </div>
                <TextInput
                  id="name"
                  type="name"
                  placeholder="CS_SEPC"
                  required
                />
              </div>
              <div>
                <div className="m-2 block">
                  <Label htmlFor="email1" value="Your email" />
                </div>
                <TextInput
                  id="email"
                  type="email"
                  placeholder="testUser@studentorg.grinnell.edu"
                  required
                />
              </div>
              <div>
                <div className="m-2 block">
                  <Label htmlFor="password" value="Your password" />
                </div>
                <TextInput
                  id="password"
                  type="password"
                  placeholder="Loveweb1234@"
                  required
                />
              </div>
              <div>
                <div className="m-2 block">
                  <Label htmlFor="budget" value="Your Total budget" />
                </div>
                <TextInput
                  id="budget"
                  type="budget"
                  placeholder="2000"
                  required
                />
              </div>
              <div>
                <div className="m-2 block">
                  <Label htmlFor="user_type" value="Are you?" />
                </div>
                <Select
                  id="user_type"
                  name="user_type"
                  data-testid="new-budget-form-input-user_type"
                  required
                >
                  {UserTypes.map(userType => (
                    <option key={userType}>{userType}</option>
                  ))}
                </Select>
              </div>

              <Button type="submit" className="bg-pallete-5">
                Create Account
              </Button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
