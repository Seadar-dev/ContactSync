import express from 'express'
import bodyParser from 'body-parser'

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Webhook server is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is listening on port ${PORT}`);
});

app.post('/webhook', (req, res) => {
  console.log('Webhook event received:', req.body);
  res.status(200).send('OK');

});