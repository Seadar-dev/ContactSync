import express from 'express';
import { cleanBody } from '../utils.js';
import { renew } from '../azure/subscribe.js';
import masterCreate from '../masterSync/masterCreate.js';
import masterEdit from '../masterSync/masterEdit.js';
import masterDelete from '../masterSync/masterDelete.js';


const router = express.Router();

router.post('/', async (req, res) => {
  console.log("Master Webhook called");
  const logChange = req.app.locals.logChange;


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


  switch (req.body.value[0].changeType) {

    case "updated":
      await masterEdit(body, logChange)
      break;
    case "created":
      await masterCreate(body, logChange)
      break;
    case "deleted":
      await masterDelete(body, logChange)
      break;
    default:
      res.status(400).send("Unknown change type");
      return;
  }

  res.status(200).send("Contact fixed successfully");
});

router.post('/backup', async (req, res) => {
  console.log("Master Webhook backup called")

  // Validates validation request
  if (req.query && req.query.validationToken) {
    res.set('Content-Type', 'text/plain');
    res.send(req.query.validationToken);
    return;
  }
  if (req?.body?.value[0]?.lifecycleEvent) {
    const sub = await renew(req?.body?.value[0]?.subscriptionId);
    res.status(200).send("RENEWED MASTER");
    return;
  }

  res.status(200).send("OK")
});

export default router;