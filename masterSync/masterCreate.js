import auth from "../azure/auth.js";

export default async function masterCreate(body, logChange) {
  console.log("Master Create");

  const client = await auth();

  console.log(JSON.stringify({ ...body, spouseName: body.id }))

  const newContact = await client.api(process.env.DIRECTORY_PATH).post(JSON.stringify({ ...body, spouseName: body.id }));

  logChange(newContact.changeKey);

  const res = await client.api(`${process.env.MASTER_PATH}/${body.id}`).patch({ spouseName: newContact.id });

  return;

}
