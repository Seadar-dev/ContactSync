import auth from "./auth.js";
import { SUBBED_FIELDS, expirationDate } from "../utils.js";

//An Abstract subscribe function. Makes a subscription given certain parameters
async function subscribe(path, urlRoute) {
  const client = await auth();

  const subscription = {
    changeType: 'created,updated,deleted',
    notificationUrl: `${process.env.APP_URL}${urlRoute}`,
    lifecycleNotificationUrl: `${process.env.APP_URL}${urlRoute}/backup`,
    resource: `${path}?$select=${SUBBED_FIELDS.join()}`,
    expirationDateTime: expirationDate(),
    clientState: '123456789',
    includeResourceData: true,
    encryptionCertificate: Buffer.from(process.env.AZURE_ENCRYPTION_CERT).toString('base64'),
    encryptionCertificateId: process.env.AZURE_ENCRYPTION_ID,
  };

  try {
    const res = await client.api('/subscriptions').post(subscription);
    console.log(`New Subscription for ${urlRoute}: ${res.id}`)
    return res;
  } catch (err) {
    console.error(`Error creating subscription for ${urlRoute}: ${err.message}`)
  }


}

//Renew's the subscription -- Autotmatically called when needed
export async function renew(id) {
  const client = await auth();
  const subscription = {
    expirationDateTime: expirationDate()
  };
  try {
    const res = await client.api(`/subscriptions/${id}`).update(subscription);
    return res
  } catch (err) {
    console.error(`Error while renewing ${id}: ${err.message}`);
  }
}

// Unsubscribes from one specific subscription
export async function unsubscribe(id) {
  console.log("Unsubscribing - " + id);
  const client = await auth();
  try {
    const res = await client.api(`/subscriptions/${id}`).delete();
    console.log("Unsubscribed from: " + id)
  } catch (err) {
    console.error(`Error while unsubscribing ${id}: ${err.message}`);
  }
}

// Unsubscribes from every active subscription

export async function unsubscribeAll() {
  const client = await auth();
  const subs = await subscriptions();
  for (const subscription of subs) {
    try {
      const res = await client.api(`/subscriptions/${subscription.id}`).delete();
    } catch (err) {
      console.error(`Error while unsubscribing ${subscription.id}: ${err.message}`);
    }
  }
  return `Unsubscribed from ${subs.length} subscriptions`;
}

//Gets all the relevant subscriptions
export async function subscriptions() {
  const client = await auth();
  try {
    let subscriptions = await client.api('/subscriptions').get();
    const filtered = subscriptions.value.filter(val => {
      return val.notificationUrl === `${process.env.APP_URL}masterWebhook` || val.notificationUrl === `${process.env.APP_URL}webhook`
    })
    return filtered;
  } catch (e) {
    console.error("Error while fetching subscriptions: " + e.message);
  }

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