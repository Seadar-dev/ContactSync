import express from 'express';
import refresh from '../masterSync/refresh.js';
const router = express.Router();

//Refreshes the whole list of contacts
router.post('/', async (req, res) => {
  console.log("Refreshing contacts");
  res.status(200).send("REFRESHING")
  await refresh(req.app.locals.logChange);
})

export default router;