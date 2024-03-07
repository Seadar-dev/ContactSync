import { masterContact } from "../../utils.js";
import auth from "../auth.js";

export default async function undoCreate(body) {
  const client = await auth();

  const isValid = await validateCreate(client, body);

  if (isValid) return;

  const res = await client.api(`${process.env.DIRECTORY_PATH}/${body.id}`).delete();

  console.log(res);

  console.log("Undoing Create")
  return;
}

async function validateCreate(client, body) {
  const masterContactId = body.spouseName;
  if (masterContactId == undefined || masterContactId == null) return false;

  try {
    const contact = await masterContact(client, masterContactId);
    return contact.spouseName == body.id;
  } catch (err) {
    return false;
  }

}