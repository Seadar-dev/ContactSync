import express from 'express'
import bodyParser from 'body-parser'
import { undoEdit, undoCreate, undoDelete } from "./azure/fixes/index.js";
import { directorySubscribe, masterSubscribe, renew, subscriptions, unsubscribe, unsubscribeAll } from './azure/subscribe.js';
import refresh from './masterSync/refresh.js';
import { cleanBody, decrypt } from './utils.js';
import masterEdit from './masterSync/masterEdit.js';
import masterCreate from './masterSync/masterCreate.js';
import masterDelete from './masterSync/masterDelete.js';
import subsciptionsRoute from "./routes/subscriptions.js"
import subscribeRoute from "./routes/subscribe.js";
import renewRoute from "./routes/renew.js";
import unsubscribeRoute from "./routes/unsubscribe.js";
import refreshRouter from "./routes/refresh.js";

const app = express();
app.use(bodyParser.json());

app.use('/subscriptions', subsciptionsRoute);
app.use('/subscribe', subscribeRoute);
app.use('/renew', renewRoute);
app.use('/unsubscribe', unsubscribeRoute);
app.use('/refresh', refreshRouter);




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is listening on port ${PORT}`);
});

//Maintains a running Set of the changes IDs that should not be propagated
//Our webhook triggers when the directory changes, and we in turn change it again -- that change we make is considered validated and is included in this Set
app.locals.verifiedChanges = new Set();
//A function for adding to the set
app.locals.logChange = (changeKey) => app.locals.verifiedChanges.add(changeKey)
const logChange = (changeKey) => app.locals.verifiedChanges.add(changeKey)



//Checks if the changeKey is in the set, true if it needs to be reverted
//If the change is valid, removes the changeKey from the set. sends an OK
const invalidChangeKey = (dirtyRequest, res) => {
  const changeKey = dirtyRequest.resourceData["@odata.etag"].substring(3, dirtyRequest.resourceData["@odata.etag"].length - 1);
  console.log(`CHECKING KEY ${changeKey}`);
  if (app.locals.verifiedChanges.has(changeKey)) {
    app.locals.verifiedChanges.delete(changeKey);
    console.log("Validated Change");
    res.status(200).send("OK");

    return false;
  }
  return true
}



// THIS IS THE WEBHOOK CALLBACK, ONLY CALLED BY AZURE
app.post('/webhook', async (req, res) => {
  console.log("Webhook called");


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
  const body = cleanBody(req);

  console.log(body);

  const isValid = invalidChangeKey(dirtyRequest, res);
  if (!isValid) return;


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
    res.status(200).send("RENEWED");
    return;
  }

  res.status(200).send("OK")
});

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
  const dirtyRequest = req.body.value[0];

  const body = cleanBody(req);

  const isValid = invalidChangeKey(dirtyRequest, res);
  if (!isValid) return;

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
    res.status(200).send("RENEWED");
    return;
  }

  res.status(200).send("OK")
});

