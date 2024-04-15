'use client';

import { Button, Label, Modal, Textarea, TextInput } from 'flowbite-react';
import { FormEvent, FormEventHandler, useState } from 'react';
import { HiPlusCircle } from 'react-icons/hi';

export function NewBudgetForm({
  user_id,
  createBudgetAction,
}: {
  user_id: string;
  createBudgetAction: (
    userID: string,
    name: string,
    description: string
  ) => Promise<void>;
}) {
  const [openModal, setOpenModal] = useState(false);

  const submit: FormEventHandler<HTMLFormElement> = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = (e.currentTarget.elements.namedItem('event_name') as HTMLInputElement).value
    const description = (e.currentTarget.elements.namedItem('description') as HTMLInputElement).value
    setOpenModal(false);
    createBudgetAction(
      user_id,
      name,
      description
    );
  };

  return (
    <>
      <Button
        data-testid="new-budget-form-button-add"
        className="fixed bottom-0 right-0 p-6"
        onClick={() => setOpenModal(true)}
      >
        <HiPlusCircle className="w-24 h-24" />
      </Button>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header> Create a new Event </Modal.Header>
        <Modal.Body>
          <div className="bg-white">
            <form
              className="flex max-w-md flex-col gap-4 bg-white"
              onSubmit={submit}
            >
              <div>
                <div className="m-2 block">
                  <Label htmlFor="event-name" value="Name" />
                </div>
                <TextInput
                  id="event_name"
                  name="event_name"
                  data-testid="new-budget-form-input-name"
                  required
                />
              </div>
              <div>
                <div className="m-2 block">
                  <Label htmlFor="description" value="Description" />
                </div>
                <Textarea
                  id="description"
                  name="description"
                  data-testid="new-budget-form-input-description"
                  required
                />
              </div>
              <Button
                data-testid="new-budget-form-button-submit"
                type="submit"
                className="bg-pallete-5"
              >
                Submit
              </Button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
