import auth from "./azure/auth.js";

import { SUBBED_ARRAY_FIELDS, SUBBED_STRING_FIELDS, decrypt, directoryContact, masterContact } from "./utils.js";
import dotenv from 'dotenv';
import refresh from "./masterSync/refresh.js";
import { directorySubscribe, masterSubscribe } from "./azure/subscribe.js";
dotenv.config();

export default async function test() {
  const client = await auth();


  // console.log(`${SUBBED_STRING_FIELDS.join()},${SUBBED_ARRAY_FIELDS.join()}`)

  const res = await masterContact(client, "AAMkADRlNjIzZjM3LTY3N2MtNDc3ZS05NzRlLTM2ZGU1MzRmYWM5ZQBGAAAAAADszkAOWRo1Rby9RYdEXMnwBwAUJ6N5tVAjRqN7KFWSXWgnAABwBtqnAAAUJ6N5tVAjRqN7KFWSXWgnAABwBviOAAA=");
  console.log(res);
}
test();




