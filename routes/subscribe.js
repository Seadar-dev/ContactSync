import express from 'express'
import { directorySubscribe, masterSubscribe } from '../azure/subscribe.js';
const router = express.Router()

// Creates a subscription to thew directory
router.post('/', async (req, res) => {
  console.log("Subscribing");
  const sub = await directorySubscribe();
  res.status(200).send(`SUBSCRIBED: ${sub.id}`)
})

//Creates a subscription to the master
router.post('/master', async (req, res) => {
  console.log("Subscribing to Master");
  const sub = await masterSubscribe();
  res.status(200).send(`SUBSCRIBED: ${sub.id}`)
})


export default router;