import auth from "./auth";

const client = await auth()

const subscription = {
  changeType: 'created,updated',
  notificationUrl: 'https://webhook.azurewebsites.net/notificationClient',
  lifecycleNotificationUrl: 'https://webhook.azurewebsites.net/api/lifecycleNotifications',
  resource: '/me/mailfolders(\'inbox\')/messages',
  expirationDateTime: '2016-03-20T11:00:00.0000000Z',
  clientState: 'SecretClientState'
};

await client.api('/subscriptions').post(subscription);