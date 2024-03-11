import auth from "../azure/auth.js";
import { SUBBED_ARRAY_FIELDS, SUBBED_STRING_FIELDS, masterContact } from "../utils.js";


export default async function masterEdit(body, logChange) {
  console.log("Master Edit");


  const client = await auth();

  let contact;
  try {
    contact = await masterContact(client, body.id);
  } catch (err) {
    console.log(err)
    return;
  }


  let temp = {};
  [...SUBBED_ARRAY_FIELDS, ...SUBBED_STRING_FIELDS].forEach(field => temp[field] = contact[field]);

  console.log({ ...temp, spouseName: body.id });
  const newContact = await client.api(`${process.env.DIRECTORY_PATH}/${contact.spouseName}`).patch({ ...temp, spouseName: body.id });

  logChange(newContact.changeKey);

  return;
}