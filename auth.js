import dotenv from 'dotenv';
import * as msal from "@azure/msal-node";
import { Client } from '@microsoft/microsoft-graph-client';

dotenv.config();

async function getAccessToken() {
  const clientConfig = {
    auth: {
      clientId: process.env.AZURE_CLIENT_ID,
      clientSecret: process.env.AZURE_CLIENT_SECRET,
      authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`
    }
  };
  const cca = new msal.ConfidentialClientApplication(clientConfig);

  // With client credentials flows permissions need to be granted in the portal by a tenant administrator.
  // The scope is always in the format "<resource>/.default"
  const clientCredentialRequest = {
    scopes: ["https://graph.microsoft.com/.default"]
  };

  const res = await cca.acquireTokenByClientCredential(clientCredentialRequest)
  return res.accessToken;
}


export default async function auth() {


  let clientOptions = {
    authProvider: {
      getAccessToken
    },
  };

  const client = Client.initWithMiddleware(clientOptions);

  try {
    let userDetails = await client.api(`users/${process.env.DIRECTORY_ID}/contactFolders/${process.env.FOLDER_ID}/contacts/AAMkADkyYzcwNmNiLWFiMDAtNDg1OC05NTkwLTUwMjBmOTk1NGJjMwBGAAAAAACnxXzxFZ7YS5DJ7xpznyfgBwB3gke_SN33QInYpZ0MWwuWAAAAABEYAAB3gke_SN33QInYpZ0MWwuWAAAAAZb5AAA=`).patch({
      birthday: "1991-07-22"
    });
    console.log(userDetails);
  } catch (error) {
    throw error;
  }

  return client
}