## .Env Setup
-   Duplicate the file `.env-template` and rename it `.env`

### Private Key
-   Go to [https://console.firebase.google.com]
-   Login and go to the NZPMC project
-   Settings > Users and permissions > Service Accounts
-   Click "Generate new Private Key"
-   Put this in your working directory
-   Rename to `serviceAccount.json`
-   Add it to the .gitignore (if it isn't already ignored)
-   Change the `.env` variable `GOOGLE_APPLICATION_CREDENTIALS` to point to the private key

### Firebase API Key 
-   Go to [https://console.cloud.google.com/apis/credentials?project=nzpmc-backend]
-   Copy the API key
-   Change the `.env` variable `FIREBASE_API_KEY` to match this key.    

## Usage

```
npm install
npm run start
```
