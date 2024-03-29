import auth from "../azure/auth.js";
import { masterContact, SUBBED_FIELDS } from "../utils.js";


//Reads the edit of the master contact, and updates the directory contact
export default async function masterEdit(body, logChange) {
  console.log("Master Edit");
  const client = await auth();

  let contact;
  try {
    console.log("fetching: " + body.id)
    contact = await masterContact(client, body.id);
  } catch (err) {
    console.error("Error while fetching master: " + err.message)
    return;
  }

  if (!contact.spouseName || !body.id) return;

  let temp = {};
  SUBBED_FIELDS.forEach(field => temp[field] = contact[field]);

  console.log({ ...temp, spouseName: body.id });

  try {
    const fixedContact = await client.api(`${process.env.DIRECTORY_PATH}/${contact.spouseName}`).patch({ ...temp, spouseName: body.id });
    logChange(fixedContact.changeKey);
  } catch (err) {
    console.error("Error whil;e syncing master edit: " + err.message)
  }

}