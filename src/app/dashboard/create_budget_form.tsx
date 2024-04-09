'use client';

import {Button, Label, Modal, TextInput} from 'flowbite-react';
import {useState} from 'react';
import {createBudget} from './actions';
import {HiPlusCircle} from 'react-icons/hi';

export function NewBudgetForm({user_id}: {user_id: string}) {
  const [openModal, setOpenModal] = useState(false);

  const [name, setName] = useState('Dance Party');
  const [description, setDescription] = useState('Lots of Dancing and Fun');
  const [location, setLocation] = useState('HSSC N114');
  const [date, setDate] = useState('2024-MM-DD');
  const [type, setType] = useState('SEPC');
  const [cost, setCost] = useState('$500');


  const submit = () => {
    setOpenModal(false);
    createBudget(user_id, name, description, location, date, type);
  };

  return (
    <>
      <Button
        className="fixed bottom-0 right-0 p-6"
        onClick={() => setOpenModal(true)}
      >
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
                  onChange={e => setName(e.target.value)}
                  value = {name}
                  required
                />
              </div>
              <div>
                <div className="m-2 block">
                  <Label htmlFor="description" value="Description" />
                </div>
                <TextInput
                  id="description"
                  onChange={e => setDescription(e.target.value)}
                  value = {description}
                  required
                />
              </div>
              <div>
               <div className="m-2 block">
                  <Label htmlFor="event-location" value="Event Location" />
                </div>
                <TextInput
                  id="event_location"
                  onChange={e => setLocation(e.target.value)}
                  value = {location}
                  required
                />
              </div>
              <div>
               <div className="m-2 block">
                  <Label htmlFor="event-date" value="Event Date" />
                </div>
                <TextInput
                  id="event_date"
                  onChange={e => setDate(e.target.value)}
                  value = {date}
                  required
                />
              </div>
              <div>
               <div className="m-2 block">
                  <Label htmlFor="event-type" value="Event Type" />
                </div>
                <TextInput
                  id="event_type"
                  onChange={e => setType(e.target.value)}
                  value = {type}
                  required
                />
              </div>
              <div>
               <div className="m-2 block">
                  <Label htmlFor="total-cost" value="Total Cost" />
                </div>
                <TextInput
                  id="total_cost"
                  onChange={e => setCost(e.target.value)}
                  value = {cost}
                  required
                />
              </div>
              <Button onClick={submit} className="bg-pallete-5">
                Submit
              </Button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
