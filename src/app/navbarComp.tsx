'use client';

import Image from 'next/image';
import {Button, Navbar} from 'flowbite-react';

export function ComponentNav({buttonLabel}: {buttonLabel: string}) {
  return (
    <Navbar
      fluid
      className="bg-pallete-1 items-center justify-between mx-auto md:w-auto p-3 order-1"
    >
      <Navbar.Brand href="/">
        <Image
          src="gbudget-logo.png"
          alt="Gbudget Logo"
          width={40}
          height={40}
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold text-black">
          GBudget
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <a
          href="/help"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Button
            type="button"
            className="text-left text-black bg-pallete-1 font-medium text-sm order-1"
          >
            Help
          </Button>
        </a>
        <Button className="bg-pallete-5 font-medium text-sm w-28 h-10">
          {buttonLabel}
        </Button>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse className="justify-between hidden w-full md:flex md:w-auto md:order-1">
        <Navbar.Link
          href="/dashboard"
          active
          className="text-black text-base font-medium"
        >
          Dashboard
        </Navbar.Link>
        <Navbar.Link href="#" className="text-black text-base font-medium">
          Profile
        </Navbar.Link>
        <Navbar.Link href="#" className="text-black text-base font-medium">
          Contact Us
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
