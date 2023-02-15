## Setup

-   Duplicate the file `.env-template` and rename it `.env`
-   Go to [https://console.firebase.google.com]
-   Login and go to the NZPMC project
-   Settings > Users and permissions > Service Accounts
-   Click "Generate new Private Key"
-   Put this in your working directory
-   Add it to the .gitignore (if it isn't already ignored)
-   Change the directory in your `.env` file to point to the private key

### Example .env

```
# ENV

## GraphQL Port
PORT=4000

## Google Service key
GOOGLE_APPLICATION_CREDENTIALS=/mnt/c/Users/alexk/Documents/programming/nzpmc/nzpmc_backend/nzpmc-backend-firebase-adminsdk-zw688-fcbda08d11.json
```

## Usage

```
npm install
npm start
```
