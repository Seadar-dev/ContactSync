import { masterContact } from "../../utils.js";
import auth from "../auth.js";

//Reverts invalidated creates
export default async function undoCreate(body) {
  const client = await auth();
  console.log("Undoing Create")
  try {
    const res = await client.api(`${process.env.DIRECTORY_PATH}/${body.id}`).delete();

  } catch (err) {
    console.error("Error while undoing create: " + err.message);
  }
  return;
}
