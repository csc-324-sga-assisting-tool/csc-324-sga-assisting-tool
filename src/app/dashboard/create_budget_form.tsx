"use client"

import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState } from 'react';
import { createBudget } from "./actions";
import { HiPlusCircle } from "react-icons/hi";


export function NewBudgetForm({ user_id }: { user_id: string }) {
  const [openModal, setOpenModal] = useState(false);

  const [name, setName] = useState("Dance Party");
  const [description, setDescription] = useState("Lots of Dancing and Fun");

  const submit = () => {
    setOpenModal(false);
    createBudget(user_id, name, description);
  }

  return (
    <>
      <Button className="fixed bottom-0 right-0 p-6" onClick={() => setOpenModal(true)}>
        <HiPlusCircle className="w-24 h-24" />
      </Button>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header> Create a new Budget </Modal.Header>
        <Modal.Body>
          <div className="bg-white">
            <form className="flex max-w-md flex-col gap-4 bg-white">
              <div>
                <div className="m-2 block">
                  <Label htmlFor="event-name" value="Event Name" />
                </div>
                <TextInput
                  id="event_name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required />
              </div>
              <div>
                <div className="m-2 block">
                  <Label htmlFor="description" value="Description" />
                </div>
                <TextInput
                  id="description"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  required />
              </div>
              <Button onClick={submit} className='bg-pallete-5'>Submit</Button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
