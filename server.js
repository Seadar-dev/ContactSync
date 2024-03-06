import express from 'express'
import bodyParser from 'body-parser'
import fixContact from './azure/fixContact.js';

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Webhook server is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is listening on port ${PORT}`);
});

app.post('/webhook', async (req, res) => {
  await fixContact();
  res.status(200).send('OK');
});