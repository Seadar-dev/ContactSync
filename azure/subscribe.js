import auth from "./auth.js";

export default async function subscribe() {
  const client = await auth();
  console.log(expirationDate())

  const subscription = {
    changeType: 'created,updated',
    notificationUrl: 'https://contact-sync-80dc8f320a31.herokuapp.com/webhook',

    lifecycleNotificationUrl: 'https://contact-sync-80dc8f320a31.herokuapp.com/webhook/backup',
    resource: `/users/${process.env.DIRECTORY_ID}/contactFolders/${process.env.FOLDER_ID}/contacts/`,
    expirationDateTime: expirationDate(),
    clientState: '123456789'
  };

  const res = await client.api('/subscriptions').post(subscription);
  console.log(res);
  return res;
}

// subscribe()

export async function renew(id) {
  console.log("Renewing")

  const client = await auth();
  const subscription = {
    expirationDateTime: expirationDate()
  };

  const res = await client.api(`/subscriptions/${id}`)
    .update(subscription);
  console.log(res);
}

export async function unsubscribe(id) {
  const client = await auth();
  await client.api(`/subscriptions/${id}`)
    .delete();
}

function expirationDate() {
  let expirationDate = new Date();
  // expirationDate.setDate(expirationDate.getDate() + 6);
  expirationDate.setMinutes(expirationDate.getMinutes() + 3);
  return expirationDate;
}