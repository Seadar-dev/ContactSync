import auth from "../azure/auth.js";
import { masterContact, SUBBED_ARRAY_FIELDS, SUBBED_STRING_FIELDS } from "../utils.js";

export default async function masterCreate(body, logChange) {
  console.log("Master Create");

  console.log(body);

  const client = await auth();

  let contact;
  try {
    console.log("fetching: " + body.id)
    contact = await masterContact(client, body.id);
  } catch (err) {
    console.log("Master contact not found in Create");
    return;
  }


  let temp = {};
  [...SUBBED_ARRAY_FIELDS, ...SUBBED_STRING_FIELDS].forEach(field => temp[field] = contact[field]);

  console.log({ ...temp, spouseName: body.id });
  const newContact = await client.api(process.env.DIRECTORY_PATH).post({ ...temp, spouseName: body.id });

  // console.log(JSON.stringify({ ...body, spouseName: body.id }))

  // const newContact = await client.api(process.env.DIRECTORY_PATH).post(JSON.stringify({ ...body, spouseName: body.id }));

  logChange(newContact.changeKey);

  const res = await client.api(`${process.env.MASTER_PATH}/${body.id}`).patch({ spouseName: newContact.id });
  logChange(res.changeKey);

  console.log(res)

  return;

}
