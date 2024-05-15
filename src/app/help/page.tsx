'use client';
// import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import {Card, Accordion} from 'flowbite-react';
import Image from 'next/image';
import {ComponentSlide} from 'app/help/tutorial';
import {ComponentNav} from 'app/navbarComp';

function ComponentCard() {
  return (
    <Card
      className="items-center justify-between text-center mx-auto md:w-auto h-60 p-5"
      renderImage={() => (
        <Image
          width={100}
          height={90}
          src="gbudget-logo.png"
          alt="image 1"
          className="item-left"
        />
      )}
    >
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Frequently Asked Questions
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Find links to SGA resources, descriptions of GBudgets procedure, and a
        simple tutorial to submit your first budget!!
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
            Check the status of the budget plan! If the status becomes to
            `&quot;`Approved`&quot;`, the budget plan is approved by SGA
            treasure, and you can start the next process! If the status is
            `&quot;`Denied`&quot;`, you are able to see the comments from the
            SGA treasure, modify and resubmit the budget plan. If the status is
            `&quot;`Pending`&quot;`, please give SGA treasure more time to go
            through your budget plan!
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Check out this guide to learn how to&nbsp; and start developing
            websites even faster with components on top of Tailwind CSS.
          </p>
        </Accordion.Content>
      </Accordion.Panel>
      <Accordion.Panel>
        <Accordion.Title className="flex bg-gray-100 items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 dark:text-gray-400 gap-3">
          How do I download/reuse my past budget?
        </Accordion.Title>
        <Accordion.Content className="bg-white">
          <p className="text-gray-500 dark:text-gray-400 ">
            You can click the `&quot;`Duplicate event`&quot;` button on the
            right side of each budget plan to reuse the past budgets.
          </p>
        </Accordion.Content>
      </Accordion.Panel>
      <Accordion.Panel>
        <Accordion.Title className="flex bg-gray-100 items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 dark:text-gray-400 gap-3">
          Tutorials: Make and submit your first budget!!!
        </Accordion.Title>
        <Accordion.Content className="bg-white">
          <ComponentSlide />
        </Accordion.Content>
      </Accordion.Panel>
      <Accordion.Panel>
        <Accordion.Title className="flex bg-gray-100 items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 dark:text-gray-400 gap-3">
          How do I contact the SGA treasure when the budget plan has been under
          review for a long time?
        </Accordion.Title>
        <Accordion.Content className="bg-white">
          <p className="text-gray-500 dark:text-gray-400">
            You can click the `&quot;`Contact`&quot;` tab on the top of the
            website to find the contact info for SGA treasure.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Or you can click the `&quot;`request review`&quot;` button again to
            remind the SGA treasure to review the budget plan as soon as
            possible.
          </p>
          <ul className="list-disc pl-5 text-gray-500 dark:text-gray-400"></ul>
        </Accordion.Content>
      </Accordion.Panel>
      <Accordion.Panel>
        <Accordion.Title className="flex bg-gray-100 items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 dark:text-gray-400 gap-3">
          Are there any security measures to protect the privacy?
        </Accordion.Title>
        <Accordion.Content className="bg-white">
          <p className="text-gray-500 dark:text-gray-400"></p>
          <p className="text-gray-500 dark:text-gray-400"></p>
          <ul className="list-disc pl-5 text-gray-500 dark:text-gray-400"></ul>
        </Accordion.Content>
      </Accordion.Panel>
      <Accordion.Panel>
        <Accordion.Title className="flex bg-gray-100 items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 dark:text-gray-400 gap-3">
          What if the question I want to ask is not covered in the Q&A page?
        </Accordion.Title>
        <Accordion.Content className="bg-white">
          <p className="text-gray-500 dark:text-gray-400">
            You can upload more questions here (link), and the developingt team
            will publish the answer as soon as possible.
          </p>
          <ul className="list-disc pl-5 text-gray-500 dark:text-gray-400"></ul>
        </Accordion.Content>
      </Accordion.Panel>
    </Accordion>
  );
}

export default function Home() {
  return (
    <main className="bg-pallete-2 dark:bg-slate-800">
      <div>
        <ComponentNav buttonLabel={'Log Out'} />
      </div>
      <div className="mt-16">
        <ComponentCard />
        <ComponentAcc />
      </div>
    </main>
  );
}
