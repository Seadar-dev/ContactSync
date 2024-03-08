import auth from "./azure/auth.js";

import { decrypt, directoryContact, masterContact } from "./utils.js";
import dotenv from 'dotenv';
import refresh from "./masterSync/refresh.js";
dotenv.config();

export default async function test() {
  const client = await auth();

  // const SirMasterTestingDir = await directoryContact(client, "AAMkADkyYzcwNmNiLWFiMDAtNDg1OC05NTkwLTUwMjBmOTk1NGJjMwBGAAAAAACnxXzxFZ7YS5DJ7xpznyfgBwB3gke_SN33QInYpZ0MWwuWAAAAABEYAAB3gke_SN33QInYpZ0MWwuWAAAAApDOAAA=")
  // console.log(SirMasterTestingDir);

  // const res = await client.api(`${process.env.DIRECTORY_PATH}/${id}`).patch({ generation: "fifth" });

  // console.log(res);
  // const res = await client.api(`${process.env.DIRECTORY_PATH}/${id}`).expand("extensions").get();

  const id = "AAMkADkyYzcwNmNiLWFiMDAtNDg1OC05NTkwLTUwMjBmOTk1NGJjMwBGAAAAAACnxXzxFZ7YS5DJ7xpznyfgBwB3gke_SN33QInYpZ0MWwuWAAAAABEYAAB3gke_SN33QInYpZ0MWwuWAAAAApDjAAA="

  const res = await client.api(`${process.env.DIRECTORY_PATH}/${id}`).delete();

  console.log(res);

  // await refresh();
}
test();




