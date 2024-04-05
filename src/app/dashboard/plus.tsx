'use client';

import {Button, Modal, Checkbox, Label, TextInput} from 'flowbite-react';
import {useState} from 'react';
import {HiOutlineExclamationCircle} from 'react-icons/hi';

function FormBudget() {
  return (
    <form className="flex max-w-md flex-col gap-4">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="budget_id" value="budget_id" />
        </div>
        <TextInput id="budget_id" type="budgetID" placeholder="test_budget" required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="event-name" value="Event Name" />
        </div>
        <TextInput id="event-name" type="eventName" placeholder="Dance Party" required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="description" value="Event Description" />
        </div>
        <TextInput id="description" type="description" placeholder="Fun Dance for life" required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="cost" value="Event Cost" />
        </div>
        <TextInput id="cost" type="number" placeholder='1000' required />
      </div>
      {/* <div className="flex items-center gap-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember">Remember me</Label>
      </div> */}
      <Button type="submit" className='bg-pallete-5'>Submit</Button>
    </form>
  );
}


function PlusBudget() {
    const [openModal, setOpenModal] = useState(false);

  return (
    <div className="items-end md:order-2 ">
      <Button
        className="bg-pallete-5 justify-self-end"
        onClick={() => setOpenModal(true)}
      >
        make budget
      </Button>
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Body>
          <div className="text-center">
            <FormBudget/>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export {PlusBudget};
