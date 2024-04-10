import crypto from 'crypto';

//These are all the fields that we subscribe to of the contact. When included here, the fields will sync
//SpouseName is used as a shared ID, it is required
export const SUBBED_FIELDS = [
  "jobTitle", "birthday", "givenName", "surname", "title", "generation", "spouseName", "middleName", "companyName", "department", "emailAddresses", "businessPhones", "homePhones"
]

//Makes a subscription expiration date, six days after issuing
export function expirationDate() {
  let expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 6);
  return expirationDate;
}

//Decrypts the contents of the webhook into a JSON object
// Microsoft API is very secure with that content
export function decrypt(cert, dataKey, data) {
  const base64encodedKey = dataKey; /*'base 64 encoded dataKey value' */
  const asymetricPrivateKey = cert/*'pem encoded private key'; */
  const decodedKey = Buffer.from(base64encodedKey, 'base64');
  const decryptedSymetricKey = crypto.privateDecrypt(asymetricPrivateKey, decodedKey);
  const base64encodedPayload = data /*'base64 encoded value from data property'*/;
  const iv = Buffer.alloc(16, 0);
  decryptedSymetricKey.copy(iv, 0, 0, 16);
  const decipher = crypto.createDecipheriv('aes-256-cbc', decryptedSymetricKey, iv);
  let decryptedPayload = decipher.update(base64encodedPayload, 'base64', 'utf8');
  decryptedPayload += decipher.final('utf8');
  return JSON.parse(decryptedPayload)
}

//Given a req, decrypts and formats it into a clean Contact object
export function cleanBody(req) {
  const dirtyRequest = req.body.value[0];
  let body = decrypt(process.env.AZURE_PRIVATE_KEY, dirtyRequest.encryptedContent.dataKey, dirtyRequest.encryptedContent.data);
  body.id = dirtyRequest.resourceData.id;
  return body;
}

// Gets the contact from the master directory
export async function masterContact(client, id) {
  return await client.api(`${process.env.MASTER_PATH}/${id}`).get();
}

// Gets the contact from the directory
export async function directoryContact(client, id) {
  return await client.api(`${process.env.DIRECTORY_PATH}/${id}`).get();
}

// Finds the Master contact by Directory contact id
export async function findInMaster(client, id) {
  let response;
  try {
    response = (await client.api(`${process.env.MASTER_PATH}?filter=spouseName eq '${id}'`).get()).value.find(master => master.spouseName === id)
  } catch (err) {
    console.log(err);
  }
  return response
}
