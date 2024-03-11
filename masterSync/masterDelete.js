export default async function masterDelete(body) {
  console.log("Master Delete");

  const contactToDelete = (await client.api(`${process.env.MASTER_PATH}`).get()).value.find(directory => directory.spouseName === body.id);

  const res = await client.api(`${process.env.DIRECTORY_PATH}/${contactToDelete.id}`).delete();
  console.log(res)
}