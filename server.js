import express from 'express'
import bodyParser from 'body-parser'
import fixContact from './azure/fixContact.js';

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
  await fixContact();
  if (req.query && req.query.validationToken) {
    res.set('Content-Type', 'text/plain');
    res.send(req.query.validationToken);
    return;
  }
  res.status(200).send("OK")
});

app.post('/webhook/backup', async (req, res) => {
  console.log("Webhook backup called")
  // await fixContact();
  if (req.query && req.query.validationToken) {
    res.set('Content-Type', 'text/plain');
    res.send(req.query.validationToken);
    return;
  }
  res.status(200).send("OK")
});