import auth from "../auth.js";
import { SUBBED_FIELDS, directoryContact, masterContact } from "../../utils.js";


export default async function undoEdit(body, addChangeKey) {
  const client = await auth();

  if (!body?.spouseName || !body.id) return;

  console.log("Fixing: " + body.id);

  console.log(body)


  const contact = await masterContact(client, body.spouseName);
  console.log("Master Contact: ", contact);
  let temp = {};
  SUBBED_FIELDS.forEach(field => temp[field] = contact[field]);

  const res = await client.api(`${process.env.DIRECTORY_PATH}/${body.id}`).patch({ ...temp, spouseName: body.spouseName });

  addChangeKey(res.changeKey);

  return;
}
