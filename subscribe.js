import auth from "./azure/auth.js";

const client = await auth()

const subscription = {
  changeType: 'created,updated',
  notificationUrl: 'https://battle-abalone-swamp.glitch.me/webhook',

  lifecycleNotificationUrl: 'https://battle-abalone-swamp.glitch.me/webhook/backup',
  resource: `/users/${process.env.DIRECTORY_ID}/contactFolders/${process.env.FOLDER_ID}/contacts/`,
  expirationDateTime: '2025-01-01T11:00:00.0000000Z',
  clientState: '123456789'
};

const res = await client.api('/subscriptions').post(subscription);
console.log(res);

// https://glitch.com/edit/#!/battle-abalone-swamp