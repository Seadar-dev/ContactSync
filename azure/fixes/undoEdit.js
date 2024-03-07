import auth from "../auth.js";

export default async function undoEdit() {
  const client = await auth();

  const isValid = await validateEdit(client)

  console.log("Undoing Edit")
  return;
}

function validateEdit() {

}