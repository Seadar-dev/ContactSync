import express from 'express'
import { subscriptions } from '../azure/subscribe.js';
const router = express.Router()

//Gets a list of all active subscriptions
router.get('/', async (req, res) => {
  console.log("Getting subscriptions");
  const allSubscriptions = await subscriptions();
  res.status(200).send(allSubscriptions)
})
export default router;