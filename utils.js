import crypto from 'crypto';

export function expirationDate() {
  let expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 6);
  return expirationDate;
}

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