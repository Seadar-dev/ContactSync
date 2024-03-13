import auth from "../auth.js";
import { SUBBED_FIELDS, masterContact } from "../../utils.js";

//Reverts the invalidated edit
export default async function undoEdit(body, addChangeKey) {
  const client = await auth();

  if (!body?.spouseName || !body.id) return;

  console.log("Fixing: " + body.id + " to " + body.spouseName);
  try {

    const contact = await masterContact(client, body.spouseName);
    let temp = {};
    SUBBED_FIELDS.forEach(field => temp[field] = contact[field]);

    const res = await client.api(`${process.env.DIRECTORY_PATH}/${body.id}`).patch({ ...temp, spouseName: body.spouseName });
    addChangeKey(res.changeKey);
  } catch (err) {
    console.log("Error while undoing edit: " + err.message);

  }

  return;
}
