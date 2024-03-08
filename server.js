import express from 'express'
import bodyParser from 'body-parser'
import { undoEdit, undoCreate, undoDelete } from "./azure/fixes/index.js";
import subscribe, { masterSubscribe, renew, subscriptions, unsubscribe } from './azure/subscribe.js';
import refresh from './masterSync/refresh.js';
import { decrypt } from './utils.js';
import masterEdit from './masterSync/masterEdit.js';
import masterCreate from './masterSync/masterCreate.js';
import masterDelete from './masterSync/masterDelete.js';

const app = express();
app.use(bodyParser.json());

var subscriptionId = null;
const verifiedChanges = new Set();
const logChange = (changeKey) => verifiedChanges.add(changeKey)


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
  let body = decrypt(process.env.AZURE_PRIVATE_KEY, dirtyRequest.encryptedContent.dataKey, dirtyRequest.encryptedContent.data);
  body.id = dirtyRequest.resourceData.id

  const changeKey = dirtyRequest.resourceData["@odata.etag"].substring(3, dirtyRequest.resourceData["@odata.etag"].length - 1);
  console.log(`CHECKING KEY ${changeKey}`);

  if (verifiedChanges.has(changeKey)) {
    verifiedChanges.delete(changeKey);
    console.log("Validated Change");
    res.status(200).send("OK");

    return;
  }
  console.log(verifiedChanges)


  switch (req.body.value[0].changeType) {

    case "updated":
      await undoEdit(body, logChange)
      break;
    case "created":
      await undoCreate(body, logChange)
      break;
    case "deleted":
      await undoDelete(body, logChange)
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
  res.status(200).send(`SUBSCRIBED: ${sub.id}`)
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
  await refresh(logChange);
  res.status(200).send("OK")
})

app.get('/changekeys', async (req, res) => {
  console.log("Pending changekeys");
  res.status(200).send(JSON.stringify(verifiedChanges))
})

app.post('/masterWebhook', async (req, res) => {
  console.log("Master Webhook called")

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

  switch (req.body.value[0].changeType) {

    case "updated":
      await masterEdit(body, logChange)
      break;
    case "created":
      await masterCreate(body, logChange)
      break;
    case "deleted":
      await masterDelete(body, logChange)
      break;
    default:
      res.status(400).send("Unknown change type");
      return;
  }

  res.status(200).send("Contact fixed successfully");
});

app.post('/masterWebhook/backup', async (req, res) => {
  console.log("Master Webhook backup called")

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

app.post('/masterSubscribe', async (req, res) => {
  console.log("Subscribing to Master");
  const sub = await masterSubscribe();
  res.status(200).send(`SUBSCRIBED: ${sub.id}`)
})