import auth from "../auth.js";

export default async function undoDelete(body) {
  const client = await auth();
  // const isValid = await validateDelete(client, body)
  // if (isValid) return true;

  const contactToUpload = (await client.api(`${process.env.MASTER_PATH}`).get()).value.find(master => master.spouseName === body.id);

  const newContact = await client.api(`${process.env.DIRECTORY_PATH}`).post({ ...contactToUpload, spouseName: contactToUpload.id });
  const res = await client.api(`${process.env.MASTER_PATH}/${contactToUpload.id}`).patch({ spouseName: newContact.id });

  console.log("Undoing Delete")
  return;
}

async function validateDelete(client, body) {
  console.log("BODY: ", body);
  const res = (await client.api(`${process.env.MASTER_PATH}`).get()).value.find(master => master.spouseName === body.id);

  console.log("Found: ", res);

  if (!res) return true;
  return false;

}