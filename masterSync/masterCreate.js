import auth from "../azure/auth.js";
import { masterContact, SUBBED_FIELDS } from "../utils.js";

//Reads the create of a Master Contact, and matches the create in the directory
export default async function masterCreate(body, logChange) {
  console.log("Master Create");
  const client = await auth();

  let contact;
  try {
    console.log("fetching: " + body.id)
    contact = await masterContact(client, body.id);
  } catch (err) {
    console.error("Error while fetching Master: " + err.message);
    return;
  }

  let temp = {};
  SUBBED_FIELDS.forEach(field => temp[field] = contact[field]);

  try {
    const newContact = await client.api(process.env.DIRECTORY_PATH).post({ ...temp, spouseName: body.id });

    logChange(newContact.changeKey);

    const res = await client.api(`${process.env.MASTER_PATH}/${body.id}`).patch({ spouseName: newContact.id });
    logChange(res.changeKey);

  } catch (err) {
    console.error("Error while syncing with Master create: " + err.message);
  }

  return;

}
