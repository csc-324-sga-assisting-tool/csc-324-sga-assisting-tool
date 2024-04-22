'use client';

import {
  Button,
  Datepicker,
  Label,
  Modal,
  Select,
  Textarea,
  TextInput,
} from 'flowbite-react';
import {EventType, EventTypes} from 'lib/data';
import {FormEvent, FormEventHandler, useState} from 'react';
import {HiPlusCircle} from 'react-icons/hi';

export function NewBudgetForm({
  user_id,
  user_name,
  createBudgetAction,
}: {
  user_id: string;
  user_name: string;
  createBudgetAction: (
    userID: string,
    userName: string,
    name: string,
    description: string,
    event_location: string,
    event_date: string,
    event_type: EventType
  ) => Promise<void>;
}) {
  const [openModal, setOpenModal] = useState(false);

  const submit: FormEventHandler<HTMLFormElement> = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const name = (
      e.currentTarget.elements.namedItem('event_name') as HTMLInputElement
    ).value;
    const description = (
      e.currentTarget.elements.namedItem('description') as HTMLInputElement
    ).value;

    const location = (
      e.currentTarget.elements.namedItem('event_location') as HTMLInputElement
    ).value;

    const date = (
      e.currentTarget.elements.namedItem('event_date') as HTMLInputElement
    ).value;

    const eventType = (
      e.currentTarget.elements.namedItem('event_type') as HTMLInputElement
    ).value as EventType;

    setOpenModal(false);

    createBudgetAction(
      user_id,
      user_name,
      name,
      description,
      location,
      date,
      eventType
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
                  data-testid="new-budget-form-input-description"
                  required
                />
              </div>
              <div>
                <div className="m-2 block">
                  <Label htmlFor="event-location" value="Event Location" />
                </div>
                <TextInput
                  id="event_location"
                  name="event_location"
                  data-testid="new-budget-form-input-location"
                />
              </div>

              <div>
                <div className="m-2 block">
                  <Label htmlFor="event-date" value="Event Date" />
                </div>
                <Datepicker
                  id="event_date"
                  name="event_date"
                  minDate={new Date()}
                  data-testid="new-budget-form-input-datepicker"
                  required
                />
              </div>
              <div>
                <div className="m-2 block">
                  <Label htmlFor="event-type" value="Event Type" />
                </div>
                <Select
                  id="event_type"
                  name="event_type"
                  data-testid="new-budget-form-input-event-type"
                  required
                >
                  {EventTypes.map(eventType => (
                    <option key={eventType}>{eventType}</option>
                  ))}
                </Select>
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
