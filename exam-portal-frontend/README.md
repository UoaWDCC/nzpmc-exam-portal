# nzpmc

## Project setup
```
npm install
```

Add a firebaseConfig.json file into the working directory. You can retreive the contents of this file by going into Firebase > NZPMC Backend > Project Settings > General then look for SDK setup and configuration. The JS object in the firebaseConfig variable is the contents of firebaseConfig.json.

https://console.firebase.google.com/u/0/project/nzpmc-backend/settings/general

Make a copy of .env-template and rename to .env

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Folder structure
Every folder represents a different route that directs to ```index.vue```. Other files are general components, typically rendered by that folder's ```index.vue```.
