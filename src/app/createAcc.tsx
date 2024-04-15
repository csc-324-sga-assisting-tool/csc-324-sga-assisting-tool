'use client';

import {Button, Label, Checkbox, Modal, TextInput} from 'flowbite-react';
import { sep } from 'path';
import {useState} from 'react';
import { createUser } from './auth';

export function SignUp() {
  const [openModal, setOpenModal] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [budget, setBudget] = useState(0);
  const [sepc, setSEPC] = useState(false);
  // ...


  const submit = () => {
    setOpenModal(false);
    createUser(email, name, email, password, sepc, budget);
    // return (
    //   <div>
    //     <a href="/dashboard" ></a>
    //   </div>
      
    // )

    // open dashboard for user
  };

  return (
    <>
      <Button
        className="flex font-medium text-sm text-black underline-offset-auto "
        onClick={() => setOpenModal(true)}
      >
        Don't have an account? Sign up
      </Button>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header> Create a new Account </Modal.Header>
        <Modal.Body>
          <div className="bg-white">
            <form className="flex max-w-md flex-col gap-4 bg-white">
              <div>
                <div className="m-2 block">
                  <Label htmlFor="name" value="Your RSO name" />
                </div>
                <TextInput
                  id="name" 
                  type="name"
                  placeholder='CS_SEPC'
                  onChange={e => setName(e.target.value)}
                  value={name}
                  required
                />
              </div>
              <div>
                <div className="m-2 block">
                  <Label htmlFor="email1" value="Your email" />
                </div>
                <TextInput
                  id="email1" 
                  type="email" 
                  placeholder="testUser@studentorg.grinnell.edu" 
                  onChange={e => setEmail(e.target.value)}
                  value={email}
                  required
                />
              </div>
              <div>
                <div className="m-2 block">
                  <Label htmlFor="password" value="Your password" />
                </div>
                <TextInput
                  id="password1" 
                  type="password"
                  placeholder='Loveweb1234@'
                  onChange={e => setPassword(e.target.value)}
                  value={password}
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
                  placeholder='$2000'
                  onChange={e => setBudget(e.target.valueAsNumber)}
                  value={budget}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="sepc" onChange={e => setSEPC(!sepc)}/>
                <Label htmlFor="sepc">Are you an SEPC</Label>
              </div>
              <Button  onClick={submit} className="bg-pallete-5">
                Create Account
              </Button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}



function Component() {
  return (
    <form className="flex max-w-md flex-col gap-4">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email1" value="Your email" />
        </div>
        <TextInput 
          id="email1" 
          type="email" 
          placeholder="name@flowbite.com" required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password1" value="Your password" />
        </div>
        <TextInput 
          id="password1" 
          type="password" required />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember">Remember me</Label>
      </div>
      <Button type="submit"
        className="bg-pallete-5 font-medium text-sm w-28 h-10"
      >
        Submit
      </Button>
    </form>
  );
}
