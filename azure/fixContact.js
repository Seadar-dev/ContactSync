import auth from "./auth.js";

export default async function fixContact() {
  const client = await auth();

  try {
    let userDetails = await client.api(`users/${process.env.DIRECTORY_ID}/contactFolders/${process.env.FOLDER_ID}/contacts/AAMkADkyYzcwNmNiLWFiMDAtNDg1OC05NTkwLTUwMjBmOTk1NGJjMwBGAAAAAACnxXzxFZ7YS5DJ7xpznyfgBwB3gke_SN33QInYpZ0MWwuWAAAAABEYAAB3gke_SN33QInYpZ0MWwuWAAAAAZb5AAA=`).patch({
      birthday: "1991-07-22"
    });
    console.log(userDetails);
  } catch (error) {
    throw error;
  }
}