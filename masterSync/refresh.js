import auth from "../azure/auth.js";

// Aligns the directory with master
export default async function refresh(logChange) {
  const client = await auth();

  let masterContacts;
  let directoryContacts;

  try {
    masterContacts = (await client.api(`${process.env.MASTER_PATH}?$Top=1000`).get()).value
    directoryContacts = (await client.api(`${process.env.DIRECTORY_PATH}?$Top=1000`).get()).value;
  } catch (err) {
    console.error("Failed to fetch all contacts for refresh: " + err.message)
  }


  const visited = new Set();
  //Empties the Directory of old data
  for (var contactToDelete of directoryContacts) {
    visited.add(contactToDelete.id)
    try {
      const res = await client.api(`${process.env.DIRECTORY_PATH}/${contactToDelete.id}`).delete();
    } catch (err) {
      console.error("Failed to delete contact before refresh: " + err.message)
    }
  }

  for (var contactToUpload of masterContacts) {
    if (!visited.has(contactToUpload.spouseName)) {

      try {
        //Make the contact in Directory -- the generation field points to the root Master contact id
        const newContact = await client.api(`${process.env.DIRECTORY_PATH}`).post({ ...contactToUpload, categories: ['Internal'], spouseName: contactToUpload.id });

        logChange(newContact.changeKey)

        //Make the root Master contact generation hold its assosciated Directory contact ID
        const res = await client.api(`${process.env.MASTER_PATH}/${contactToUpload.id}`).patch({ spouseName: newContact.id });
      } catch (err) { console.error("Failed to upload new contacts in refresh:" + err.message); }
    }
  }

}

