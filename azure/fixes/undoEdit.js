import auth from "../auth.js";
import { SUBBED_FIELDS, findInMaster, masterContact } from "../../utils.js";

//Reverts the invalidated edit
export default async function undoEdit(body, addChangeKey) {
  const client = await auth();

  if (!body.id) return;

  console.log("Fixing: " + body.id + " to " + body.spouseName);
  try {

    let contact;
    try {
      contact = await masterContact(client, body.spouseName);
    } catch (err) {
      contact = await findInMaster(body.id);
    }
    let temp = {};
    SUBBED_FIELDS.forEach(field => temp[field] = contact[field]);

    const res = await client.api(`${process.env.DIRECTORY_PATH}/${body.id}`).patch({ ...temp, spouseName: contact.id });
    addChangeKey(res.changeKey);
  } catch (err) {
    console.error("Error while undoing edit: " + err.message);

  }

  return;
}
