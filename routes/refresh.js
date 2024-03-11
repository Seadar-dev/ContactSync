import express from 'express';
import refresh from '../masterSync/refresh.js';
const router = express.Router();

//Refreshes the whole list of contacts
router.post('/', async (req, res) => {
  console.log("Refreshing contacts");
  await refresh(req.app.locals.logChange);
  res.status(200).send("OK")
})

export default router;