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
  try {
    let clientOptions = {
      authProvider: {
        getAccessToken
      },
    };

    const client = Client.initWithMiddleware(clientOptions);
    return client
  } catch (err) {
    console.error("Failed to authenticate: " + err.message);
  }
}