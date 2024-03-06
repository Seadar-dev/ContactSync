import express from 'express'
import bodyParser from 'body-parser'
import fixContact from './azure/fixContact.js';
import subscribe, { renew, unsubscribe } from './azure/subscribe.js';

const app = express();
app.use(bodyParser.json());


app.get('/', (req, res) => {
  console.log("Get request called")
  res.send('Webhook server is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is listening on port ${PORT}`);
});

app.post('/webhook', async (req, res) => {
  console.log("Webhook called")

  //Checks if validation request
  if (req.query && req.query.validationToken) {
    res.set('Content-Type', 'text/plain');
    res.send(req.query.validationToken);
    return;
  }


  await fixContact();
  res.status(200).send("OK")
});

app.post('/webhook/backup', async (req, res) => {
  console.log("Webhook backup called")
  console.log(req.body.value[0].subscriptionId);
  await renew(req.body.value[0].subscriptionId)
  res.status(200).send("OK")
});

app.post('/subscribe', async (req, res) => {
  console.log("Subscribing");
  await subscribe();
  res.status(200).send("SUBSCRIBED")
})

app.post('/renew', async (req, res) => {
  console.log("Renewing");

  await renew("e0b6b09e-73d6-4223-bfe0-9ee862c04af5");
  res.status(200).send("RENEWED")
})

app.delete('/unsubscribe', async (req, res) => {
  console.log("Unsubscribing");

  await unsubscribe();
  res.status(200).send("UNSUBSCRIBED")
})