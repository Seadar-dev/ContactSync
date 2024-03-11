import express from 'express';
import { cleanBody } from '../utils.js';
import undoEdit from '../azure/fixes/undoEdit.js';
import undoCreate from '../azure/fixes/undoCreate.js';
import undoDelete from '../azure/fixes/undoDelete.js';
import { renew } from '../azure/subscribe.js';
const router = express.Router();

// THIS IS THE WEBHOOK CALLBACK, ONLY CALLED BY AZURE
router.post('/', async (req, res) => {
  console.log("Webhook called");


  // Validates validation request
  if (req.query && req.query.validationToken) {
    res.set('Content-Type', 'text/plain');
    res.send(req.query.validationToken);
    return;
  }

  if (!req?.body?.value[0]?.changeType) {
    res.status(400).send("Invalid request body");
    return;
  }

  const dirtyRequest = req.body.value[0];
  const body = cleanBody(req);

  const isValid = req.app.locals.invalidChangeKey(dirtyRequest, res);
  if (!isValid) return;

  const logChange = req.app.locals.logChange;


  switch (req.body.value[0].changeType) {

    case "updated":
      await undoEdit(body, logChange)
      break;
    case "created":
      await undoCreate(body, logChange)
      break;
    case "deleted":
      await undoDelete(body, logChange)
      break;
    default:
      res.status(400).send("Unknown change type");
      return;

  }

  res.status(200).send("Contact fixed successfully");
});

// THIS IS THE WEBHOOK LIFECYCLE, ONLY CALLED BY AZURE

router.post('/backup', async (req, res) => {
  console.log("Webhook backup called")

  // Validates validation request
  if (req.query && req.query.validationToken) {
    res.set('Content-Type', 'text/plain');
    res.send(req.query.validationToken);
    return;
  }
  if (req?.body?.value[0]?.lifecycleEvent) {
    const sub = await renew(req?.body?.value[0]?.subscriptionId);
    res.status(200).send("RENEWED");
    return;
  }

  res.status(200).send("OK")
});

export default router;