import { json } from "body-parser";
import { decrypt, masterContact } from "../../utils.js";
import auth from "../auth.js";

export default async function undoCreate(body) {
  console.log("Cleaned body: ", body)
  const client = await auth();

  const isValid = await validateCreate(client, body);
  console.log(isValid)

  console.log("Undoing Create")
  return;
}

async function validateCreate(client, body) {
  const masterContactId = body.spouseName;
  if (masterContactId == undefined || masterContactId == null) return false;

  try {
    const contact = await masterContact(client, masterContactId);
    console.log("Assosciated Mater Contact: ", contact)
    return contact.spouseName == body.id;
  } catch (err) {
    return false;
  }

}