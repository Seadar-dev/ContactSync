import auth from "../auth.js";
import { masterContact } from "../../utils.js";


export default async function undoEdit(body) {
  const client = await auth();

  const isValid = await validateEdit(client, body)

  console.log("Undoing Edit")
  return;
}

async function validateEdit(client, body) {
  const masterContactId = body.spouseName;
  if (masterContactId == undefined || masterContactId == null) return false;

  try {
    const contact = await masterContact(client, masterContactId);
    let isSame = true;
    isSame = isSame && contact.spouseName == body.id;
    // isSame =

    console.log("Directory Contact: ", body);
    console.log("Assosciated Master Contact: ", contact);




  } catch (err) {
    return false
  }
}

const EQUALITY_FIELDS = [
  // "fileAs", "displayName", "givenName", "initials", "surname",
]