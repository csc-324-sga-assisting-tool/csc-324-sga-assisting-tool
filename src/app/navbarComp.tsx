"use client";

import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";

type childSign = {
  name: string,
}
//FIX: logo does not appear in main page
export function ComponentNav(propC: childSign) {
  return (
    <Navbar fluid className='bg-pallete-1 items-center justify-between mx-auto md:w-auto p-3'>
      <Navbar.Brand href="/csc-324-sga-assisting-tool">
        <img src="gbudget-logo.png" className="mr-3 sm:h-9" alt="Gbudget Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold text-black">GBudget</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <a href="/csc-324-sga-assisting-tool/help" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Button type="button" className="text-left text-black bg-pallete-1 font-medium text-sm order-1">Help</Button>
        </a>
        <Button className='bg-pallete-5 font-medium text-sm w-28 h-10'>{propC.name}</Button>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse className="justify-between hidden w-full md:flex md:w-auto md:order-1">
        <Navbar.Link href="/csc-324-sga-assisting-tool/dashboard" active className='text-black text-base font-medium'>
          Dashboard
        </Navbar.Link>
        <Navbar.Link href="#" className='text-black text-base font-medium'>Profile</Navbar.Link>
        <Navbar.Link href="#" className='text-black text-base font-medium'>Contact Us</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
