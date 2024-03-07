import auth from "./azure/auth.js";

import { decrypt, masterContact } from "./utils.js";
import dotenv from 'dotenv';
import refresh from "./masterSync/refresh.js";
dotenv.config();

export default async function fixContact() {
  const client = await auth();



  const test = await masterContact(client, "AAMkADRlNjIzZjM3LTY3N2MtNDc3ZS05NzRlLTM2ZGU1MzRmYWM5ZQBGAAAAAADszkAOWRo1Rby9RYdEXMnwBwAUJ6N5tVAjRqN7KFWSXWgnAABwBtqnAAAUJ6N5tVAjRqN7KFWSXWgnAABwBvh_AAA=")



  console.log(test)


}
fixContact();




