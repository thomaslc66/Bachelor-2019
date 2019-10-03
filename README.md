

# Gamification of a fitness trail
### Bachelor 2019
##### Author: Lechaire Thomas

This repository contain all the sources needed to implement the all project.

#### Description of the folders

 - Code: This folder contain all the source code for tehe mobile application.  
 - Raspberry: This folder contain the necessary to recreate all the interactional boxes
 - Server: Contain the flow to recreate the game central server
 - Rapport : Contain the analyse and bachelor essai


###  Code Folder
##### EddyStone & Estimote

Those two applications are android studio project that where used to test and analyse the estimote beacons solution. 

##### React-native
First off all, this application was only tested on Android. Testing it on iOs was not required in the specifications.
To test it out, you will need to install yarn or npm and react-native-cli to complete this task.

Depending on the Os on your computer you can find a way to install it using google. Here is a pretty straight forward guide for windows user : https://blog.teamtreehouse.com/install-node-js-npm-windows

When this is ok, you can get and install react-native-cli 
```
npm install -g react-native-cli
``` 
more information can be founded here: https://facebook.github.io/react-native/docs/getting-started, you have the information for all 3 major computer Os, so no worries.

When react-native is installed, you can open the folder and run : ```npm install or yarn install``` depending on which one you prefere. This will download and install all needed dependencies for the application to run without a bug.

Then you will need to create a project using the firebase console: https://console.firebase.google.com
Open your project and go in  : Database -> cloud Firestore

![DataBase](https://i.imgur.com/D0K5GBg.png)  
Then you will need to create the database from the export.json file it the database folder. For this you can use this repository to import all the data in FireStore: https://github.com/dalenguyen/firestore-import-export , you will only need to change in import/export.js the database name and give the serviceAccountKey.json from your database.

In the database folder, you will find the export of the game collection and the users collection. Thoses 2 files can be then imported into your new project.

Don't forget to go into the authentification panel and activate the password and email authentification method.

![Password authentification](https://i.imgur.com/u3zD3k3.png)

##### Getting the serviceAccountKey.json
You will need a service key for importing the database and to run the android application you will need to download the google-services.json. 

The serviceAccountKey.json is the key to authenticate your app with the Firebase services. You can retrive it from your firbase account , then service account and the clik on generate new private key.

For the google-services.json you juste need to go in the parameters of the project and the in the general tab and download the json.

The json file needs to be put in the android -> app folder:

![google-services.json](https://i.imgur.com/hs4b4gK.png)
### Database Folder
This database contains the two export from the database in order to import them in your Firebase project.

game.json and user.json

In game.json, you will find all the enigmas code, and game geofences that you can change to suit your needs.

In user.json you will have dummy user entries, fell free to delete them.

##### run it
To run the app, when everything is ok, you need to run 
```
react-native run-android
```
For this to work you need to have either a android phone connected to your computer or and emulator running.
Note: Sometimes you need to run this command twice as the communication between the phone and the server is messy.

### Raspberry Folder
This folder contain an image of the raspberry with all the libraries you will need to create a new one. In this folder you will have two subfolders that contains the flows of each box and the common script for the modem connection. You will need to edit this script to match with your cell phone provider apn.

The image comes installed with:

- Node-red
- MQTT & a broker (Mosquitto)
- The necessary library for the modem to work

What you still need to do:

- Import the node red flows or create a new one
- Connect, wire all the electronical component to suits your need.
- Change the modem configuration script to match with the apn of your provider.

### Rapport Folder
Contain the bachelor analyse and explainations.
