import auth from "../auth.js";

export default async function undoDelete(body) {
  const client = await auth();
  await validateDelete(client)

  console.log("Undoing Delete")
  return;
}

async function validateDelete(client, id) {
  const res = (await client.api(`${process.env.MASTER_PATH}`).get())
  console.log(res);

}