import auth from "./azure/auth.js";

import { decrypt } from "./utils.js";
import dotenv from 'dotenv';
import refresh from "./masterSync/refresh.js";
dotenv.config();

export default async function fixContact() {
  const client = await auth();

  const contact = await client.api(process.env.DIRECTORY_PATH).get()
  const contact2 = await client.api(process.env.MASTER_PATH).get()

  // AAMkADkyYzcwNmNiLWFiMDAtNDg1OC05NTkwLTUwMjBmOTk1NGJjMwBGAAAAAACnxXzxFZ7YS5DJ7xpznyfgBwB3gke_SN33QInYpZ0MWwuWAAAAABEYAAB3gke_SN33QInYpZ0MWwuWAAAAABUUAAA=`).get()

  console.log(contact);
  console.log(contact2);


  // try {
  //   let userDetails = await client.api(`users/${process.env.DIRECTORY_ID}/contactFolders/${process.env.FOLDER_ID}/contacts/AAMkADkyYzcwNmNiLWFiMDAtNDg1OC05NTkwLTUwMjBmOTk1NGJjMwBGAAAAAACnxXzxFZ7YS5DJ7xpznyfgBwB3gke_SN33QInYpZ0MWwuWAAAAABEYAAB3gke_SN33QInYpZ0MWwuWAAAAAZb5AAA=`).patch({
  //     birthday: "1991-07-22"
  //   });
  //   console.log(userDetails);
  // } catch (error) {
  //   throw error;
  // }

}
// fixContact();


const message = "D03R9AeclLLYgz1qyqL8hXIKxnTpahbUHA7npwGd8fvZwLFRDxJy9P+OKtyyliGwwjOcUV68+DyLF/JCI0nVFoXdMS3YAHcufHSVShlQUflVaCcoQ6PCXwonegPt8kmJeauTIpiZ7k2mGC9V0jJQBrT6y5SlM7BBB3QpFIs3BTMeGI1aioTzMEBrQBmyzfxApklqzk+wYJnUAORnTqsujZK40SxSiEkh7gsPhdtvvf47iavYgyrnqG0nQnMbvICdh167o3XPaiU7e4vUNTDWI8X7BbYUJP6blmmmriYLFn3dTFeLT1LNhkfSo7+nW8KQKRwamv84zbf7CZYywozkug=="

const data = "xPwYet8QqWG2HEteohAeoZsc0axjHgxeVSx/LgVfv73wxlr6QxOSakOH8Le0UEWaSFlBpq9mN5HJ2FfhXjsSF5BJT8wTYtvBeRrI/mOC9YHawOi6CMRho3x9SAdPdIpFNRa0gJ77LrGHosuhaWqjy3+1/UsK1bi7d+/qmpy24HcGEltJdXs/6Cz8J9Z0zvW5"

