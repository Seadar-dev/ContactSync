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

async function validateDelete(client, body) {
  console.log("BODY: ", body);
  const res = (await client.api(`${process.env.MASTER_PATH}`).get()).value.find(master => {
    console.log("Equality Checking: ", body.spouseName, master.id, master.id === body.spouseName)
    return master.id === body.spouseName
  });

  console.log("Found: ", res);

  if (!res) return true;
  if (res.spouseName !== body.id) return true;
  return false;

}