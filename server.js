import express from 'express'
import bodyParser from 'body-parser'
import subsciptionsRoute from "./routes/subscriptions.js"
import subscribeRoute from "./routes/subscribe.js";
import renewRoute from "./routes/renew.js";
import unsubscribeRoute from "./routes/unsubscribe.js";
import refreshRouter from "./routes/refresh.js";
import webhookRouter from "./routes/webhook.js";
import masterWebhookRouter from "./routes/masterWebhook.js";
import Airbrake from '@airbrake/node'
import { directorySubscribe, masterSubscribe, unsubscribeAll } from './azure/subscribe.js';

const app = express();
app.use(bodyParser.json());


// ROUTES
app.use('/subscriptions', subsciptionsRoute);
app.use('/subscribe', subscribeRoute);
app.use('/renew', renewRoute);
app.use('/unsubscribe', unsubscribeRoute);
app.use('/refresh', refreshRouter);
app.use('/webhook', webhookRouter);
app.use('/masterWebhook', masterWebhookRouter);


// LOCALS

//Maintains a running Set of the changes IDs that should not be propagated
//Our webhook triggers when the directory changes, and we in turn change it again -- that change we make is considered validated and is included in this Set
app.locals.verifiedChanges = new Set();
//A function for adding to the set
app.locals.logChange = (changeKey) => app.locals.verifiedChanges.add(changeKey)

app.locals.invalidChangeKey = (dirtyRequest, res) => {
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

// LISTENER
const PORT = process.env.PORT || 3000;

// ERROR ALERTS
new Airbrake.Notifier({
  projectId: 553350,
  projectKey: process.env.AIRBRAKE_KEY,
  environment: 'production'
});

app.listen(PORT, async () => {
  await unsubscribeAll();
  await masterSubscribe();
  await directorySubscribe();
  console.log(`Webhook server is listening on port ${PORT}`);
});

//TODO: debug
// Closes the server and all subscriptions
// SIGTERM is called when the current server is closed -- in Heroku
// This happens every time you deploy - it closes the old connections before opening new ones
// process.on('beforeExit', async () => {
//   await unsubscribeAll();
//   console.log("CLOSING");
//   server.close();
// })