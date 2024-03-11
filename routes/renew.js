import express from 'express'
import { renew } from '../azure/subscribe.js';
const router = express.Router()

// Renews a subscription
router.post('/', async (req, res) => {
  console.log("Renewing");

  if (!req?.query?.id) {
    res.status(400).send("Please supply a subscription id");
    return;
  }
  await renew(req?.query?.id);
  res.status(200).send("RENEWED")
})

export default router;