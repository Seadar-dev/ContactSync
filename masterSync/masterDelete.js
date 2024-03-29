import auth from "../azure/auth.js";

//Reads the delete of a Master Contact, and matches the delete in the directory
export default async function masterDelete(body, logChange) {
  console.log("Master Delete");
  const client = await auth();
  let contactToDelete;
  try {
    contactToDelete = (await client.api(`${process.env.DIRECTORY_PATH}`).get()).value.find(directory => directory.spouseName === body.id);
    if (!contactToDelete) return;

  } catch (err) {
    console.error("Error while fetching Master: " + err.message);
    return;
  }


  try {
    const res = await client.api(`${process.env.DIRECTORY_PATH}/${contactToDelete.id}`).delete();
  } catch (err) {
    console.error("Error while syncing Master delete: " + err.message);
    return;
  }
}