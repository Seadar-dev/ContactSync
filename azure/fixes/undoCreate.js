import { masterContact } from "../../utils.js";
import auth from "../auth.js";

export default async function undoCreate(body) {
  const client = await auth();
  console.log("Undoing Create")

  console.log(body)
  const res = await client.api(`${process.env.DIRECTORY_PATH}/${body.id}`).delete();

  console.log(res);

  return;
}

// async function validateCreate(client, body) {
//   const masterContactId = body.spouseName;
//   if (masterContactId == undefined || masterContactId == null) return false;

//   try {
//     const contact = await masterContact(client, masterContactId);
//     return contact.spouseName == body.id;
//   } catch (err) {
//     return false;
//   }

// }