import auth from "../auth.js";

export default async function undoDelete(body) {
  const client = await auth();
  const isValid = await validateDelete(client, body.id)
  if (isValid) return true;

  const contactToUpload = (await client.api(`${process.env.MASTER_PATH}`).get()).value.find(master => master.id === id);

  const newContact = await client.api(`${process.env.DIRECTORY_PATH}`).post({ ...contactToUpload, spouseName: contactToUpload.id });
  const res = await client.api(`${process.env.MASTER_PATH}/${contactToUpload.id}`).patch({ spouseName: newContact.id });

  console.log("Undoing Delete")
  return;
}

async function validateDelete(client, id) {
  console.log("BODY ID: " + id);
  const res = (await client.api(`${process.env.MASTER_PATH}`).get()).value.find(master => master.id === id);

  console.log(res);

  if (!res) return true;
  if (res.spouseName !== id) return true;
  return false;

}