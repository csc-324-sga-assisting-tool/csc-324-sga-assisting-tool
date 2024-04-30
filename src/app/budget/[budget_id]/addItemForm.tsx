'use client';

import {Button, Label, Modal, TextInput} from 'flowbite-react';
import {EventType} from 'lib/data';
import {FormEvent, FormEventHandler, useState} from 'react';
import {HiPlusCircle} from 'react-icons/hi';

export function NewItemForm({
  budget_id,
  createItemAction,
}: {
  budget_id: string;
  createItemAction: (
    budgetID: string,
    name: string,
    vendor: string,
    unit_price: number,
    quantity: number,
    url?: string
  ) => Promise<void>;
}) {
  const [openModal, setOpenModal] = useState(false);

  const submit: FormEventHandler<HTMLFormElement> = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const name = (
      e.currentTarget.elements.namedItem('item_name') as HTMLInputElement
    ).value;
    const vendor = (
      e.currentTarget.elements.namedItem('item_vendor') as HTMLInputElement
    ).value;

    const unit_cost = (
      e.currentTarget.elements.namedItem('item_cost') as HTMLInputElement
    ).value as unknown as number;

    const quantity = (
      e.currentTarget.elements.namedItem('item_quantity') as HTMLInputElement
    ).value as unknown as number;

    const url = (
      e.currentTarget.elements.namedItem('item_url') as HTMLInputElement
    ).value as EventType;

    setOpenModal(false);

    createItemAction(budget_id, name, vendor, unit_cost, quantity, url);
  };

  return (
    <>
      <Button
        data-testid="new-item-form-button-add"
        className="fixed bottom-0 right-0 p-6"
        onClick={() => setOpenModal(true)}
      >
        <HiPlusCircle className="w-24 h-24" />
      </Button>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header> Add an item </Modal.Header>
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
                  id="item_name"
                  name="item_name"
                  data-testid="new-item-form-input-name"
                  required
                />
              </div>
              <div>
                <div className="m-2 block">
                  <Label htmlFor="item_vendor" value="Vendor" />
                </div>
                <TextInput
                  id="item_vendor"
                  name="item_vendor"
                  data-testid="new-item-form-input-vendor"
                  required
                />
              </div>
              <div>
                <div className="m-2 block">
                  <Label htmlFor="item_cost" value="Cost (for single item)" />
                </div>
                <TextInput
                  id="item_cost"
                  name="item_cost"
                  type="number"
                  data-testid="new-item-form-input-cost"
                  required
                />
              </div>
              <div>
                <div className="m-2 block">
                  <Label htmlFor="item_quantity" value="Quantity" />
                </div>
                <TextInput
                  id="item_quantity"
                  name="item_quantity"
                  type="number"
                  data-testid="new-item-form-input-quantity"
                  required
                />
              </div>
              <div>
                <div className="m-2 block">
                  <Label htmlFor="item_url" value="Link" />
                </div>
                <TextInput
                  id="item_url"
                  name="item_url"
                  type="url"
                  placeholder="Optional"
                  data-testid="new-item-form-input-url"
                />
              </div>
              <Button
                data-testid="new-item-form-button-submit"
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
