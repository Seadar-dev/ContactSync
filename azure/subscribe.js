import auth from "./auth.js";
import { SUBBED_FIELDS, expirationDate } from "../utils.js";

//An Abstract subscribe function. Makes a subscription given certain parameters
async function subscribe(path, urlRoute) {
  const client = await auth();

  const subscription = {
    changeType: 'created,updated,deleted',
    notificationUrl: `https://contact-sync-80dc8f320a31.herokuapp.com/${urlRoute}`,
    lifecycleNotificationUrl: `https://contact-sync-80dc8f320a31.herokuapp.com/${urlRoute}/backup`,
    resource: `${path}?$select=${SUBBED_FIELDS.join()}`,
    expirationDateTime: expirationDate(),
    clientState: '123456789',
    includeResourceData: true,
    encryptionCertificate: Buffer.from(process.env.AZURE_ENCRYPTION_CERT).toString('base64'),
    encryptionCertificateId: process.env.AZURE_ENCRYPTION_ID,
  };

  const res = await client.api('/subscriptions').post(subscription);
  console.log(`New Subscription for ${urlRoute}: ${res.id}`)
  return res;
}

//Renew's the subscription -- Autotmatically called when needed
export async function renew(id) {
  const client = await auth();
  const subscription = {
    expirationDateTime: expirationDate()
  };
  const res = await client.api(`/subscriptions/${id}`).update(subscription);
  return res
}

// Unsubscribes from one specific subscription
export async function unsubscribe(id) {
  console.log("Unsubscribing - " + id);
  const client = await auth();
  try {
    const res = await client.api(`/subscriptions/${id}`).delete();
    console.log("Unsubscribed from: " + id)
  } catch (err) {
    console.log(err)
  }
}

// Unsubscribes from every active subscription

export async function unsubscribeAll() {
  const client = await auth();
  const subs = await subscriptions();
  for (const subscription of subs) {
    const res = await client.api(`/subscriptions/${subscription.id}`).delete();
  }
  return `Unsubscribed from ${subs.length} subscriptions`;
}

//Gets all the relevant subscriptions
export async function subscriptions() {
  const client = await auth();
  let subscriptions = await client.api('/subscriptions').get();
  const filtered = subscriptions.value.filter(val => {
    return val.notificationUrl === "https://contact-sync-80dc8f320a31.herokuapp.com/masterWebhook" || val.notificationUrl === "https://contact-sync-80dc8f320a31.herokuapp.com/webhook"
  })

  console.log(filtered);
  return filtered;
}

// Subscribes a webhook pointed at the Master, notifying the Heroku Server
export async function masterSubscribe() {
  const res = await subscribe(process.env.MASTER_PATH, "masterWebhook")
  return res;
}

// Subscribes a webhook pointed at the Directory, notifying the Heroku Server
export async function directorySubscribe() {
  const res = await subscribe(process.env.DIRECTORY_PATH, "webhook")
  return res;
}