import { decrypt } from "../../utils.js";
import auth from "../auth.js";

export default async function undoCreate(body) {
  const client = await auth();
  const decripted = decrypt(process.env.AZURE_PRIVATE_KEY, body.encryptedContent.dataKey, body.encryptedContent.data);
  console.log(decripted);

  console.log("Undoing Create")
  return;
}

async function validateCreate(client) { }