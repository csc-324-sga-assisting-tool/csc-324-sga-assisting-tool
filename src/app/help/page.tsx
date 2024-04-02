"use client";
// import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { ComponentNav } from "app/page";
import { Card, Accordion } from "flowbite-react";
import Image from "next/image";

function ComponentCard() {
  return (
    <Card
      className="items-center justify-between text-center mx-auto md:w-auto h-60 p-5"
      renderImage={() => <Image width={130} height={115} src="/mascot.png" alt="image 1" className="item-left"/>}
    >
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Frequently Asked Questions
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
      Find links to SGA resources, descriptions of GBudgets procedure, and a simple tutorial to submit your first budget!!
      </p>
    </Card>
  );
}

function ComponentAcc() {
  return (
    <Accordion className="bg-pallete-2 items-center justify-between mx-auto md:w-auto h-screen">
      <Accordion.Panel>
        <Accordion.Title className="bg-gray-100 flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 dark:text-gray-400 gap-3">
          How do I know when my budget is approved?
        </Accordion.Title>
        <Accordion.Content className="bg-white">
          <p className="text-gray-500 dark:text-gray-400">
            Flowbite is an open-source library of interactive components built on top of Tailwind CSS including buttons,
            dropdowns, modals, navbars, and more.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Check out this guide to learn how to&nbsp;
            and start developing websites even faster with components on top of Tailwind CSS.
          </p>
        </Accordion.Content>
      </Accordion.Panel>
      <Accordion.Panel>
        <Accordion.Title className="flex bg-gray-100 items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 dark:text-gray-400 gap-3">
          How do I download/reuse my past budget?
        </Accordion.Title>
        <Accordion.Content className="bg-white">
          <p className="text-gray-500 dark:text-gray-400 ">
            Flowbite is first conceptualized and designed using the Figma software so everything you see in the library
            has a design equivalent in our Figma file.
          </p>
        </Accordion.Content>
      </Accordion.Panel>
      <Accordion.Panel>
        <Accordion.Title className="flex bg-gray-100 items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 dark:text-gray-400 gap-3">
          Tutorials: Make and submit your first budget!!!
        </Accordion.Title>
        <Accordion.Content className="bg-white">
          <p className="text-gray-500 dark:text-gray-400">
            The main difference is that the core components from Flowbite are open source under the MIT license, whereas
            Tailwind UI is a paid product. Another difference is that Flowbite relies on smaller and standalone
            components, whereas Tailwind UI offers sections of pages.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            However, we actually recommend using both Flowbite, Flowbite Pro, and even Tailwind UI as there is no
            technical reason stopping you from using the best of two worlds.
          </p>
          <p className="text-gray-500 dark:text-gray-400">Learn more about these technologies:</p>
          <ul className="list-disc pl-5 text-gray-500 dark:text-gray-400">
          </ul>
        </Accordion.Content>
      </Accordion.Panel>
    </Accordion>
  );
}



export default function Home() {
  return (
    <main>
      <ComponentNav name ="Log Out"/>
      <ComponentCard/>
      <ComponentAcc/>


    </main>
  )
}