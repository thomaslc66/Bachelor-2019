

# Gamification of a fitness trail
### Bachelor 2019
##### Author: Lechaire Thomas

This repository contain all the sources needed to implement the all project.

### What is this project for ?

This project is part of the needs of the city of Yverdon-les-Bains to give to citizens a new way to do sport. In order to do so, they asked the HEIG-VD to do a full prototype, introducing the aspect of gamification in sport.

During this project, multiple aspects were managed to finish a full and playable game prototype. This project combine the aspects of sport and game in a on field game.

#### Game
This project is a full prototype game, the user needs to help the gardian of the natural reserve "La caricee" near the lake in Yverdon-Les-Bains and resolve a number of riddle, finding clues hidden in the field, behind stones or in trees.

To help him he can use the mobile application and the voice that give him some clues to follow the good direction and to know where to look for informations.

### Mobile Application

First the user needs to register to have an account. Like this the app can follow all of the game info, like speed, meters, altitude and time. The account give the ability to save the games and see a summary at the end.

![Register](https://i.imgur.com/zhOCXuY.png)  


The mobile application, display a map and a voice help the player to resolves the riddles. Each riddle has a delimited perimeter. The start point is the first point to be displayed. The app detects when the user enter a zone and unlocked the next riddle zone. For more info on the gameplay you can see the file "Bachelor_2019.pdf" in the "Rapport" folder or see the video down below.

![Game Screen](https://i.imgur.com/fjGPpl0.png)

### Demo (with a video)

Click on the image and put audio on to see the video.

[![Gamification Video](http://img.youtube.com/vi/ajXcGUIe75I/0.jpg)](http://www.youtube.com/watch?v=ajXcGUIe75I "Gamification")

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
