"use client";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { Budget } from "lib/data";
import {FormEvent, FormEventHandler, useState} from 'react';
import { DataProvider } from "lib/data";


export function FormBudget({dataHandler} : {dataHandler: (formData: FormData) => void }) {
  // const [event_name, setName] = useState('');
  // const [budget_id, setId] = useState('');
  // const [description, setDescription] = useState('');
  // const [cost, setCost] = useState(0);
  
  const handleSubmit: FormEventHandler<HTMLFormElement> =  async (e) => {
    e.preventDefault();
    const target = e.currentTarget;
 
    const data = {
      budget_id: target.budget_id.value,
      event_name: target.event_name.value,
      description: target.description.value,
      cost: target.cost.valueAsNumber,
    };
    //  await dataProvider.addBudgetId("test_budget_1", dataProvider.makeBudget(
    //     userID, "test_budget_1", "dance party" ,"Fun dance party", 1000, []
    //   ))
  }
  // const [event_name, setName] = useState('');
  return (
    <form className="flex max-w-md flex-col gap-4 bg-white" onSubmit={handleSubmit}>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="budget_id" value="budget_id" />
        </div>
        <TextInput 
          id="budget_id" 
          type="budgetID" 
          placeholder="test_budget"
          // value={budget_id}
          // onChange={(e) => setId(e.target.value)}
          required />
        {/* <TextInput
                id="email"
                placeholder="name@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              /> */}
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="event-name" value="Event Name" />
        </div>
        <TextInput 
          id="event_name" 
          type="eventName" 
          placeholder="Dance Party" 
          // value={event_name}
          // onChange={(e) => setName(e.target.value)}
          required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="description" value="Event Description" />
        </div>
        <TextInput 
          id="description" 
          type="description" 
          placeholder="Fun Dance for life" 
          // value={description}
          // onChange={(e) => setDescription(e.target.value)}
          required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="cost" value="Event Cost" />
        </div>
        <TextInput 
          id="cost" 
          type="number" 
          placeholder='1000' 
          // value={cost}
          // onChange={(e) => setCost(e.target.valueAsNumber)}
          required />
      </div>
      {/* <div className="flex items-center gap-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember">Remember me</Label>
      </div> */}
      <Button type="submit" className='bg-pallete-5'>Submit</Button>
    </form>
  );
}