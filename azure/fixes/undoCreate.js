import { masterContact } from "../../utils.js";
import auth from "../auth.js";

//Reverts invalidated creates
export default async function undoCreate(body) {
  const client = await auth();
  console.log("Undoing Create")
  const res = await client.api(`${process.env.DIRECTORY_PATH}/${body.id}`).delete();
  return;
}
