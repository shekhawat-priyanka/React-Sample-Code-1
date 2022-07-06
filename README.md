### To update packages follow below steps

    1) go to server folder
    2) run "npm run install-all" command in terminal

### To update packages follow below steps

    1) go to client folder
    2) run "npm run install-all" command in terminal

### Setup environment files

    1) copy client/.env.example and make client/.env for linux user use this command: cp client/.env.example client/.env
    2) copy server/.env.example and make server/.env for linux user use this command: cp server/.env.example server/.env

### To run server follow below steps

    1) go to server folder
    2) run "npm run dev" command in terminal

### OR

### To run server follow below steps

    1) go to server folder
    2) run "npm start" command in terminal
    3) go to client folder
    4) run "npm start" command in terminal

### configure MongoDB

    1) Create an account on [MongoDB Cloud](https://cloud.mongodb.com/) and setup a project
    2) Then, Build a cluster
    3) Allow it from IPs. To allow from all use 0.0.0.0/0. To add this, click on "Connect" button, it will ask the IP address.
    4. Then, Create a user for this cluster. It will as on the same screen when you click on "Connect" button.
    5) Choose a connection method "Connect your appllication". You will find a MongoDB URI connecion string in "Connect your application" tab. The Password you need to replace by created recently.
    6) Use this connection string and put in the "MONGO_URI" variable of .env file OR use default.json.

### Admin panel Credentials

    run seeder file from server: node admin_db_migration.js
    email: super.admin@yopmail.com
    password: Admin#123
