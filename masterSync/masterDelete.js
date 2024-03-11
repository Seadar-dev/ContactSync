import auth from "../azure/auth.js";

//Reads the delete of a Master Contact, and matches the delete in the directory
export default async function masterDelete(body, logChange) {
  console.log("Master Delete");
  const client = await auth();

  const contactToDelete = (await client.api(`${process.env.DIRECTORY_PATH}`).get()).value.find(directory => directory.spouseName === body.id);

  if (!contactToDelete) return;

  const res = await client.api(`${process.env.DIRECTORY_PATH}/${contactToDelete.id}`).delete();
}