import auth from "../auth.js";

export default async function undoDelete() {
  const client = await auth();
  await validateDelete(client)

  console.log("Undoing Delete")
  return;
}

async function validateDelete(client, id) {
  const res = (await client.api(`${process.env.MASTER_PATH}`).get()).find(contact => contact.id === id);
  console.log(res)
}