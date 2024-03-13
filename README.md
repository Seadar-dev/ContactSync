# ContactSync

Keeps our Company-wide Directory in sync with a Master Directory Folder. This Server reverts any user changes to Directory.

## Reason

Office has no current way to sync shared contacts into your phone's native contacts app. I've tried with shared mailboxes, shared folders, shared address lists.
The benefits:
* Onboarding: a new employee will immediately have access to our whole directory
* Transparency: anytime anyone within the company contacts you, their name will appear in the message/call.
* Security: the whole database is controlled in one central folder by only users with correct permissions
* Simplicity: just login once to the shared mailbox once, and it's synced
* Cheap: you just pay for the server to stay up. No need to pay for the databases.

## Setup

### Environment Vars

In your hosting provider set up your environment vars:

| Key           | Value      |
| ------------- | ----------:|
| APP_URL      |   [The URL of your application](#hosting)  |
| AZURE_TENANT_ID      |   [Directory (tenant) ID](#register_an_app_in_your_azure_ad)|
| AZURE_CLIENT_ID      |   [Application (client) ID](#register_an_app_in_your_azure_ad)  |
| AZURE_CLIENT_SECRET      |   [Your Client Secret for your app](#register_an_app_in_your_azure_ad)  |
| DIRECTORY_PATH      |   [The path to your shared folder](#make_a_shared_mailbox)  |
| MASTER_PATH      |   [The path to your master folder](#make_a_master_mailbox)  |
| AZURE_ENCRYPTION_ID      |   [The Certificate id of your cert](#certificate)  |
| AZURE_ENCRYPTION_CERT      |   [The string contents of your cert, starts and ends with '-----BEGIN/END CERTIFICATE-----'](#certificate)  |
| AZURE_PRIVATE_KEY      |   [The string contents of your private key, starts and ends with '-----BEGIN/END PRIVATE KEY-----'](#certificate)  |
| AIRBRAKE_KEY      |   [Your optional Airbrake key](#airbrake_(optional))  |
| AIRBRAKE_ID      |    [Your optional Airbrake id](#airbrake_(optional))  |




### Make a shared mailbox

This mailbox should have easy to remember credentials and MFA deactivated, so that it's easy to access by any non tech-savvy individual. Make a folder in the Contacts, which will serve as a shared repository for every user to access contacts. By logging into the account, Azure's ActiveSync thinks these are your contacts and thus allows your phone's native app to sync. Use graph explorer to note your shared mailbox's ID, and the directory folder's ID. Your directory path will be in this format: '/users/[MAILBOX ID]/contactFolders/[FOLDER ID]' Note this path, it will be an environment variable.

### Make a Master mailbox

This mailbox will serve as a private mailbox. Make this mailbox in your own outlook contacts, and share with only the individual's who will hasve admin access over the directory. The server will subscribe a webhook to this mailbox, and all changes will be propogated to the directory folder. Use graph explorer to note your own ID, and the master folder's ID. Your master path will be in this format:'/users/[Master ID]/contactFolders/[FOLDER ID]' Note this path, it will be an environment variable.

### Register an App in your Azure AD

Go to Azure AD, and click on App Registrations. Add a new one. This App will serve as an entrypoint for the server into the Azure API. Make a Client Secret and store it somewhere. Additionally note the Application (client) ID and Directory (tenant) ID, which you can find on the app's overview tab. The client ID, tenant ID, and client secret will all be environment vars.

### Certificate

You will need to acquire an SSL certifiacate. You may use any method you'd like; I used OpenSSL. Assosciate your cert with your app on your hosting platform. Store it in your Azure Keyvault. You will need to save the contents of your cert and private keys to your environment vars. You will also need to find your Certificate id (encryption ID) and store it.

### Hosting

Pick your hosting platform, and with it instantiate a node app. I used Heroku, and thus include a Procfile to indicate to Heroku how to enter the application, which is just "npm start". Find the url of the application and note it to be used as environment var. MAKE SURE it hsa a trailing "/". 



### Airbrake (optional)

I set up airbrake alerts so that I can notified immediately if my server crashes. If you want to include this alert, you will need to note your airbrake key and id. 




