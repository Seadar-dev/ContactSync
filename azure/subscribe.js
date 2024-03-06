import auth from "./auth.js";
import { expirationDate } from "./utils.js";

export default async function subscribe() {
  const client = await auth();

  const subscription = {
    changeType: 'created,updated',
    notificationUrl: 'https://contact-sync-80dc8f320a31.herokuapp.com/webhook',
    lifecycleNotificationUrl: 'https://contact-sync-80dc8f320a31.herokuapp.com/webhook/backup',
    resource: `/users/${process.env.DIRECTORY_ID}/contactFolders/${process.env.FOLDER_ID}/contacts?$select=emailAddress,firstName,lastName,phone,id,jobTitle,birthday,givenName,surname,mobilePhone`,
    expirationDateTime: expirationDate(),
    clientState: '123456789',
    includeResourceData: true,
    // encryptionCertificate: 
  };

  const res = await client.api('/subscriptions').post(subscription);
  console.log(res);
  return res;
}

// subscribe()

export async function renew(id) {

  const client = await auth();
  const subscription = {
    expirationDateTime: expirationDate()
  };

  const res = await client.api(`/subscriptions/${id}`)
    .update(subscription);

  return res
}

export async function unsubscribe(id) {
  console.log("Unsubscribing - " + id);
  const client = await auth();
  const res = await client.api(`/subscriptions/${id}`)
    .delete();
  console.log(res);
}

export async function subscriptions() {
  const client = await auth();
  let subscriptions = await client.api('/subscriptions')
    .get();
  console.log(subscriptions);
  return subscriptions;
}

