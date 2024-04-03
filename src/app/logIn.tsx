"use client";

import { Button, Checkbox, Label, TextInput } from "flowbite-react";

export function ComponentLog() {
  return (
    <form className="flex max-w-md flex-col gap-4 h-screen">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email1" value="Your email" />
        </div>
        <TextInput id="email1" type="email" placeholder="name@flowbite.com" required />
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
      <Button type="submit" className='bg-pallete-5 font-medium text-sm w-28 h-10'>Submit</Button>
    </form>
  );
}
