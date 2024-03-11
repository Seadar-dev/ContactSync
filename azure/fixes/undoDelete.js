import auth from "../auth.js";

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

async function validateDelete(client, body) {
  const res = (await client.api(`${process.env.MASTER_PATH}`).get()).value.find(master => master.spouseName === body.id);

  if (!res) return true;
  return false;

}