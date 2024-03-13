import { findInMaster } from "../../utils.js";
import auth from "../auth.js";

//Reverts the invalidated delete
export default async function undoDelete(body, addChangeKey) {
  const client = await auth();

  const isValidRes = await validateDelete(client, body)
  if (!isValidRes) {
    console.log("Validated Delete")
    return;
  }

  console.log("Undoing Delete")

  const contactToUpload = isValidRes

  const newContact = await client.api(`${process.env.DIRECTORY_PATH}`).post({ ...contactToUpload, spouseName: contactToUpload.id });

  addChangeKey(newContact.changeKey);

  const res = await client.api(`${process.env.MASTER_PATH}/${contactToUpload.id}`).patch({ spouseName: newContact.id });
  addChangeKey(res.changeKey);

  return;
}

//Since the information of this contact is deleted, we need to check the Master in order to retrieve it's information
async function validateDelete(client, body) {
  const res = await findInMaster(client, body.id)
  return res
}