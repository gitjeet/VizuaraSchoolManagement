"use server";
import { formSchema, formSchemaType } from "@/schemas/form";
import { currentUser } from "@clerk/nextjs";

import { database} from '../components/firebase/firebaseConfig'
class UserNotFoundErr extends Error {}

export async function GetFormStats() {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }
  
// Perform a query to fetch the total submission count from the database

    
  

  const stats = 0

  const visits = 5;
  
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  // Remove invalid characters from the email address
  const sanitizedUserEmail = userEmail?.toString().replace(/[.#$/[\]]/g, "");
  const userRef = database.ref(`users/${sanitizedUserEmail}`);
  const snapshot = await userRef.once('value');
  const userSubmissionCount = snapshot.val()?.submission || 0;
  console.log('hellos')
  const submissions =  userSubmissionCount;
  let submissionRate = 5;
  
  console.log(userEmail)
  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate,
  };
}

export async function CreateForm(data: formSchemaType) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("form not valid");
  }

  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }



  const form = {
    id:'sd',
    data: {
      userId: 'sdfdsfd',
      name:'sdfds',
      description:'asdsd',
      subject:'sdfsd',
      class:'sdf',
      school:'',
      dateFrom:'',
      dateTo:'',
    },
  };

  if (!form) {
    throw new Error("something went wrong");
  }

  return form.id;
}

export async function GetForms() {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return 0
}

export async function GetFormById(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return 0
}

export async function UpdateFormContent(id: number, jsonContent: string) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return 0
}

export async function PublishForm(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return 0
}

export async function GetFormContentByUrl(formUrl: string) {
  return 0
}

export async function SubmitForm(formUrl: string, content: string) {
  return 0
}

export async function GetFormWithSubmissions(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return 0
}
