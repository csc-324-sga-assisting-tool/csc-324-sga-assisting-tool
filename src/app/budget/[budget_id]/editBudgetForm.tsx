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
import {Budget, EventType, EventTypes} from 'lib/data';
import {FormEvent, FormEventHandler, useState} from 'react';

export function EditBudgetForm({
  budget,
  updateBudgetAction,
}: {
  budget: Budget;
  updateBudgetAction: (budget: Budget) => Promise<void>;
}) {
  const [openModal, setOpenModal] = useState(false);

  const submit: FormEventHandler<HTMLFormElement> = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const event_name = (
      e.currentTarget.elements.namedItem('event_name') as HTMLInputElement
    ).value;
    const event_description = (
      e.currentTarget.elements.namedItem('description') as HTMLInputElement
    ).value;

    const event_location = (
      e.currentTarget.elements.namedItem('event_location') as HTMLInputElement
    ).value;

    // TODO: make sure date is not in the past
    const event_datetime = (
      e.currentTarget.elements.namedItem('event_date') as HTMLInputElement
    ).value;

    const event_type = (
      e.currentTarget.elements.namedItem('event_type') as HTMLInputElement
    ).value as EventType;

    const updatedBudget: Budget = {
      ...budget,
      event_name,
      event_type,
      event_datetime,
      event_location,
      event_description,
    };

    setOpenModal(false);

    updateBudgetAction(updatedBudget);
  };

  return (
    <>
      <Button
        data-testid="edit-budget-form-button-add"
        className="bg-pallete-1 w-full text-black"
        onClick={() => setOpenModal(true)}
      >
        Edit Budget Information
      </Button>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header> Edit Budget </Modal.Header>
        <Modal.Body>
          <div className="bg-white w-full">
            <form
              className="flex w-full flex-col gap-4 bg-white"
              onSubmit={submit}
            >
              <div>
                <div className="m-2 block">
                  <Label htmlFor="event-name" value="Name" />
                </div>
                <TextInput
                  id="event_name"
                  name="event_name"
                  data-testid="edit-budget-form-input-name"
                  defaultValue={budget.event_name}
                  required
                />
              </div>
              <div>
                <div className="m-2 block">
                  <Label htmlFor="description" value="Description" />
                </div>
                <Textarea
                  id="description"
                  data-testid="edit-budget-form-input-description"
                  defaultValue={budget.event_description}
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
                  data-testid="edit-budget-form-input-location"
                  defaultValue={budget.event_location}
                />
              </div>

              <div>
                <div className="m-2 block">
                  <Label htmlFor="event-date" value="Event Date" />
                </div>
                <Datepicker
                  id="event_date"
                  name="event_date"
                  data-testid="edit-budget-form-input-datepicker"
                  defaultDate={
                    budget.event_datetime
                      ? new Date(budget.event_datetime)
                      : new Date()
                  }
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
                  data-testid="edit-budget-form-input-event-type"
                  defaultValue={budget.event_type}
                  required
                >
                  {EventTypes.map(eventType => (
                    <option key={eventType}>{eventType}</option>
                  ))}
                </Select>
              </div>
              <Button
                data-testid="edit-budget-form-button-submit"
                type="submit"
                className="bg-pallete-5"
              >
                Save Changes
              </Button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
