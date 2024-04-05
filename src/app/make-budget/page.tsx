"use server"

import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { Budget, DataProvider } from "lib/data";
import { FirebaseProvider } from "lib/data/data_loader.firebase";
import { eventNames } from "process";
import {FormEvent, FormEventHandler, useState} from 'react';
import { FormBudget } from "./form";

async function FormCall({ userID, dataProvider }: { userID: string, dataProvider: DataProvider }) {
  async function createBudget(formData: FormData) {
    'use server'
 
    const rawFormData = {
      budget_id: formData.get('budget_id') as string,
      event_name: formData.get('event_name') as string,
      description: formData.get('description') as string,
      cost: formData.get('cost') as unknown as number,
    }
    
     
    await dataProvider.addBudgetId(rawFormData.budget_id, dataProvider.makeBudget(
      userID, rawFormData.budget_id, rawFormData.event_name ,rawFormData.description, rawFormData.cost, []
    ))
  }
  return (
    <FormBudget  dataHandler={createBudget}/>
  )
}


export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return <FormCall userID="test_user" dataProvider={FirebaseProvider}/>

}

