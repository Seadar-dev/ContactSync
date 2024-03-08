import auth from "../auth.js";
import { directoryContact, masterContact } from "../../utils.js";


export default async function undoEdit(body, addChangeKey) {
  const client = await auth();

  console.log("Fixing: " + body.id);

  // const isValid = await validateEdit(client, body);
  // if (isValid) return;

  // const test = await directoryContact(client, body.id);

  // console.log(test)

  const contact = await masterContact(client, body.spouseName);
  console.log("Master Contact: ", contact);
  let temp = {};
  [...EQUALITY_FIELDS, "emailAddresses", "businessPhones"].forEach(field => temp[field] = contact[field]);
  const res = await client.api(`${process.env.DIRECTORY_PATH}/${body.id}`).patch({ ...temp, spouseName: body.spouseName });

  addChangeKey(res.changeKey);

  // console.log("New Contact: ", { ...temp, spouseName: body.spouseName });
  // console.log(res);

  return;
}

async function validateEdit(client, body) {
  const masterContactId = body.spouseName;
  if (masterContactId == undefined || masterContactId == null) return false;

  try {
    const contact = await masterContact(client, masterContactId);
    const directoryCont = await directoryContact(client, body.id)
    let isSame = contact.spouseName == body.id;

    EQUALITY_FIELDS.forEach((field) => {
      isSame = isSame && contact[field] === directoryCont[field];
    })

    isSame = isSame && JSON.stringify(contact.emailAddresses) === JSON.stringify(directoryCont.emailAddresses);

    isSame = isSame && JSON.stringify(contact.businessPhones) === JSON.stringify(directoryCont.businessPhones);

    return isSame;

  } catch (err) {
    console.log(err);
    return true;
  }
}

const EQUALITY_FIELDS = [
  "birthday", "generation", "givenName", "title", "surname", "jobTitle"
]