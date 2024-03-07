import express from 'express'
import bodyParser from 'body-parser'
import { undoEdit, undoCreate, undoDelete } from "./azure/fixes/index.js";
import subscribe, { renew, subscriptions, unsubscribe } from './azure/subscribe.js';
import refresh from './masterSync/refresh.js';

const app = express();
app.use(bodyParser.json());

var subscriptionId = null;

//Get request for testing if connection is working
app.get('/', (req, res) => {
  console.log("Get request called")
  res.send('Webhook server is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is listening on port ${PORT}`);
});

// THIS IS THE WEBHOOK CALLBACK, ONLY CALLED BY AZURE
app.post('/webhook', async (req, res) => {
  console.log("Webhook called")

  // Validates validation request
  if (req.query && req.query.validationToken) {
    res.set('Content-Type', 'text/plain');
    res.send(req.query.validationToken);
    return;
  }

  if (!req?.body?.value[0]?.changeType) {
    res.status(400).send("Invalid request body");
    return;
  }

  const dirtyRequest = req.body.value[0];
  let body = decrypt(process.env.AZURE_PRIVATE_KEY, body.encryptedContent.dataKey, body.encryptedContent.data);
  body.id = dirtyRequest.resourceData.id

  switch (req.body.value[0].changeType) {
    case "updated":
      console.log(req.body.value[0])

      await undoEdit(body)
      break;
    case "created":
      await undoCreate(body)
      break;
    case "deleted":
      console.log(req.body.value[0])

      await undoDelete(body)
      break;
    default:
      res.status(400).send("Unknown change type");
      return;

  }

  res.status(200).send("Contact fixed successfully");
});

// THIS IS THE WEBHOOK LIFECYCLE, ONLY CALLED BY AZURE

app.post('/webhook/backup', async (req, res) => {
  console.log("Webhook backup called")

  // Validates validation request
  if (req.query && req.query.validationToken) {
    res.set('Content-Type', 'text/plain');
    res.send(req.query.validationToken);
    return;
  }
  if (req?.body?.value[0]?.lifecycleEvent) {
    const sub = await renew(req?.body?.value[0]?.subscriptionId);
    subscriptionId = sub.id;
    res.status(200).send("RENEWED");
    return;
  }

  res.status(200).send("OK")
});

// Creates a subscription to the above webhook route, should almost never be called
app.post('/subscribe', async (req, res) => {
  console.log("Subscribing");
  const sub = await subscribe();
  subscriptionId = sub.id;
  res.status(200).send("SUBSCRIBED")
})

// Renews a subscription
app.post('/renew', async (req, res) => {
  console.log("Renewing");

  if (!subscriptionId && !req?.query?.id) {
    res.status(400).send("Please supply a subscription id");
    return;
  }

  console.log(req.query.id);

  const sub = await renew(req?.query?.id ? req.query.id : subscriptionId);
  subscriptionId = sub.id;

  res.status(200).send("RENEWED")
})

//Removes a subscription, should only be called when dismantling the system
app.delete('/unsubscribe', async (req, res) => {
  console.log("Unsubscribing");

  if (!subscriptionId && !req?.query?.id) {
    res.status(400).send("Please supply a subscription id");
    return;
  }

  await unsubscribe(req?.query?.id ? req.query.id : subscriptionId);
  subscriptionId = null;
  res.status(200).send("UNSUBSCRIBED")
})

//Gets a list of all active subscriptions
app.get('/subscriptions', async (req, res) => {
  console.log("Getting subscriptions");
  console.log(subscriptionId);
  const allSubscriptions = await subscriptions();
  res.status(200).send(allSubscriptions)
})

//Refreshes the whole list of contacts
app.post('/refresh', async (req, res) => {
  console.log("Refreshing contacts");
  await refresh();
  res.status(200).send("OK")
})