import { findInMaster } from "../../utils.js";
import auth from "../auth.js";

//Reverts the invalidated delete
export default async function undoDelete(body, addChangeKey) {
  const client = await auth();

  const isValid = await validateDelete(client, body)
  if (isValid) {
    console.log("Validated Delete")
    return;
  }

  console.log("Undoing Delete")

  const contactToUpload = (await client.api(`${process.env.MASTER_PATH}`).get()).value.find(master => master.spouseName === body.id);

  const newContact = await client.api(`${process.env.DIRECTORY_PATH}`).post({ ...contactToUpload, spouseName: contactToUpload.id });

  addChangeKey(newContact.changeKey);

  const res = await client.api(`${process.env.MASTER_PATH}/${contactToUpload.id}`).patch({ spouseName: newContact.id });
  addChangeKey(res.changeKey);

  return;
}

//Since the information of this contact is deleted, we need to check the Master in order to retrieve it's information
async function validateDelete(client, body) {
  console.log("Body: ", body)
  await findInMaster(client, body.id)
  console.log("Response: ", res);
  if (!res) return true;
  return false;

}