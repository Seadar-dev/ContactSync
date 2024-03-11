import express from 'express'
import bodyParser from 'body-parser'
import subsciptionsRoute from "./routes/subscriptions.js"
import subscribeRoute from "./routes/subscribe.js";
import renewRoute from "./routes/renew.js";
import unsubscribeRoute from "./routes/unsubscribe.js";
import refreshRouter from "./routes/refresh.js";
import webhookRouter from "./routes/webhook.js";
import masterWebhookRouter from "./routes/masterWebhook.js";

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


// LISTENER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is listening on port ${PORT}`);
});

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





