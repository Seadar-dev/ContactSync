import express from 'express'
import { unsubscribe, unsubscribeAll } from '../azure/subscribe.js';
const router = express.Router()


//Removes a subscription, should only be called when dismantling the system
router.delete('/', async (req, res) => {
  console.log("Unsubscribing");

  if (!req?.query?.id) {
    res.status(400).send("Please supply a subscription id");
    return;
  }

  await unsubscribe(req?.query?.id);

  res.status(200).send("UNSUBSCRIBED")
})

router.delete('/all', async (req, res) => {
  const allSubscriptions = await subscriptions();
  if (!allSubscriptions.value) {
    res.status(400).send("No subscriptions found");
    return;
  }
  await unsubscribeAll(allSubscriptions.value);

  res.status(200).send("OK")
})

export default router;