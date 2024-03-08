import auth from "../auth.js";

export default async function undoDelete(body, addChangeKey) {
  const client = await auth();
  console.log("Undoing Delete")



  const isValid = await validateDelete(client, body)
  if (isValid) return true;

  const contactToUpload = (await client.api(`${process.env.MASTER_PATH}`).get()).value.find(master => master.spouseName === body.id);

  const newContact = await client.api(`${process.env.DIRECTORY_PATH}`).post({ ...contactToUpload, spouseName: contactToUpload.id });
  addChangeKey(newContact.changeKey);
  const res = await client.api(`${process.env.MASTER_PATH}/${contactToUpload.id}`).patch({ spouseName: newContact.id });

  return;
}

async function validateDelete(client, body) {
  console.log("BODY: ", body);
  const res = (await client.api(`${process.env.MASTER_PATH}`).get()).value.find(master => master.spouseName === body.id);

  console.log("Found: ", res);

  if (!res) return true;
  return false;

}