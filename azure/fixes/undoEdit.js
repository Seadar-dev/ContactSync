import auth from "../auth.js";
import { directoryContact, masterContact } from "../../utils.js";


export default async function undoEdit(body) {
  const client = await auth();

  const isValid = await validateEdit(client, body);



  console.log("Is Valid: ", isValid)

  console.log("Undoing Edit")
  return;
}

async function validateEdit(client, body) {
  const masterContactId = body.spouseName;
  if (masterContactId == undefined || masterContactId == null) return false;

  try {
    const contact = await masterContact(client, masterContactId);
    const directoryCont = await directoryContact(client, body.id)
    let isSame = contact.spouseName == body.id;

    console.log("Master: ", contact);
    console.log("Directory: ", directoryCont);


    EQUALITY_FIELDS.forEach((field) => {
      isSame = isSame && contact[field] === directoryCont[field];
      console.log(field, isSame);
    })


    isSame = isSame && JSON.stringify(contact.emailAddresses) === JSON.stringify(directoryCont.emailAddresses);

    console.log("2", JSON.stringify(contact.emailAddresses), JSON.stringify(directoryCont.emailAddresses))
    isSame = isSame && JSON.stringify(contact.businessPhones) === JSON.stringify(directoryCont.businessPhones);

    console.log("3", JSON.stringify(contact.businessPhones) === JSON.stringify(directoryCont.businessPhones))

    return isSame;

    // console.log("Directory Contact: ", body);
    // console.log("Assosciated Master Contact: ", contact);
  } catch (err) {
    console.log(err);
    return false
  }
}

const EQUALITY_FIELDS = [
  "birthday", "generation", "givenName", "title", "surname", "jobTitle"
]