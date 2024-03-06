import express from 'express'
import bodyParser from 'body-parser'
import fixContact from './azure/fixContact.js';
import subscribe, { renew, subscriptions, unsubscribe } from './azure/subscribe.js';

const app = express();
app.use(bodyParser.json());

var subscriptionId;

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


  await fixContact();
  res.status(200).send("OK")
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

  console.log(req.body);
  // await renew(req.body)
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
  console.log(subscriptionId);

  await renew(subscriptionId);
  res.status(200).send("RENEWED")
})

//Removes a subscription, should only be called when dismantling the system
app.delete('/unsubscribe', async (req, res) => {
  console.log("Unsubscribing");

  await unsubscribe(subscriptionId);
  res.status(200).send("UNSUBSCRIBED")
})

//Gets a list of all active subscriptions
app.get('/subscriptions', async (req, res) => {
  console.log("Getting subscriptions");
  console.log(subscriptionId);
  const allSubscriptions = await subscriptions();
  res.status(200).send(allSubscriptions)
})