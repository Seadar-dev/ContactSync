import auth from "../azure/auth.js";

// Aligns the directory with master
export default async function refresh(logChange) {
  const client = await auth();

  const masterContacts = (await client.api(`${process.env.MASTER_PATH}?$Top=1000`).get()).value

  const directoryContacts = (await client.api(`${process.env.DIRECTORY_PATH}?$Top=1000`).get()).value;

  const visited = new Set();
  //Empties the Directory of old data
  for (var contactToDelete of directoryContacts) {
    visited.add(contactToDelete.id)
    const res = await client.api(`${process.env.DIRECTORY_PATH}/${contactToDelete.id}`).delete();
  }

  for (var contactToUpload of masterContacts) {
    if (!visited.has(contactToUpload.spouseName)) {
      //Make the contact in Directory -- the generation field points to the root Master contact id
      const newContact = await client.api(`${process.env.DIRECTORY_PATH}`).post({ ...contactToUpload, categories: ['Internal'], spouseName: contactToUpload.id });

      logChange(newContact.changeKey)

      //Make the root Master contact generation hold its assosciated Directory contact ID
      const res = await client.api(`${process.env.MASTER_PATH}/${contactToUpload.id}`).patch({ spouseName: newContact.id });
    }
  }

}

