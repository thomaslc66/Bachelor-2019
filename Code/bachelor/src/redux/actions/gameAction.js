/***************************************************************
 *
 * File      : gameAction.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : All actions needed for the game - Game Action Reducer
 *
 *********************************************************************/
import {
  DISPLAY_GEOFENCE,
  ENIGME_ONE_LOCKED,
  ENIGME_ONE_UNLOCKED,
  GET_GEOFENCES,
  GAME_IS_STARTED,
  OPEN_CLOSE_END_DIALOG,
  INIT_USER_POSITION,
  INIT_ALTITUDE,
  UPDATE_SPEED,
  UPDATE_SESSION_TOTAL_DISTANCE,
  UPDATE_GEOFENCE,
  UPDATE_NEGATIVE_ALTITUDE,
  UPDATE_POSITIVE_ALTITUDE,
  UPDATE_REGION,
  UPDATE_TIMER,
  START_AUDIO,
  STOP_AUDIO,
  UPDATE_SECOND_TIME_IN,
  UPDATE_FIRST_TIME_IN,
  VALIDATE_ENIGME,
  RESET_GAME,
  TIMER_START,
  TIMER_STOP,
  OPEN_CLOSE_INDICE,
  UPDATE_INDICE,
  UPDATE_TOTAL_POINT
} from '../types';
import haversine from 'haversine';
import firebase from 'react-native-firebase';
import isPointWithinRadius from 'geolib/es/isPointWithinRadius';

import { showToast, updateSessions } from './authAction';
import Sound from 'react-native-sound';
import moment from 'moment';
import zone from '../../utils/zone';
import audio from '../../utils/audio';
import indice from '../../utils/indice';
import text from '../../utils/text';
import t from 'typy';
import RNLocation from 'react-native-location';
import { publishMqttMessage } from './mqttAction';
import topic from '../../utils/mqtt_topic';

/** *****************************************************************
 *
 * @name geofenceTracking
 * @abstract this function is called everytime the user position is
 * changing.
 *
 * *****************************************************************/
export function geofenceTracking() {
  return (dispatch, getState) => {
    const { geofences } = getState().game;
    const len = geofences.length;
    geofences.map((geofence, index) => {
      if (
        geofence.isVisible &&
        dispatch(isPositionInCircle(geofence)) &&
        !geofence.firstTimeIn //if firstTimeIn or secondTimeIn is false
      ) {
        dispatch(setFirstTimeInToTrue(index));
        if (index <= len) {
          //first time in this new zone
          dispatch(gameFlow(geofence));
        }
        //maybe we need to put it after the sound is played
      }
    });
  };
}

/*************** GAME (FLOW AND LOOP) METHODS *************************/

/** *****************************************************************
 *
 * @name gameFlow
 * @param {*} param0 represent the geofence { id, secondTimeIn, firstTimeIn }
 * @abstract this function is called everytime a geofence is visible
 * and the user cross the line for the first time
 *
 * *****************************************************************/
export function gameFlow({ id, secondTimeIn, firstTimeIn }) {
  return (dispatch, getState) => {
    console.log('show id', id);

    switch (id) {
      case zone.depart.id:
        // depart zone is reached so we activate the next zone
        dispatch(activateEnigme1());
        break;
      case zone.enigme1.id:
        // enigme 1 zone is reached we play audio
        dispatch(updateIndiceAndPlayAudio(zone.enigme1.enter));
        //then we wait for the user to enter the right color code
        break;
      case zone.enigme1.reset:
        // When user is in the reset zone -> unlock the enigme 1 box
        console.log('show zone', zone.enigme1.reset);
        dispatch(unlockEnigme1());

        break;
      case zone.enigme2.id:
        dispatch(setIndice(zone.enigme2.id));
        // Check if the user enter for the second time.
        if (!firstTimeIn && !secondTimeIn) {
          //second time in, set it to true
          dispatch(updateSecondTimeIn(id, true));
          //play second audio and activate last enigme
          dispatch(validateEnigme(zone.enigme2.id));
          dispatch(activateEnigme3());
        } else {
          dispatch(activateNoisetierZone());
        }
        break;
      case zone.enigme2.noisetier.id:
        // When user is in the Noisetter zone
        //PLAY AUDIO ENTER THE NOISETIER ZONE
        dispatch(updateIndiceAndPlayAudio(zone.enigme2.noisetier.enter));
        // wait for the user to pass the key on the box and unlock
        break;
      case zone.enigme3.id:
        // When user is in the enigme 3 zone
        dispatch(updateIndiceAndPlayAudio(zone.enigme3.enter));
        // Then wait user to enter the digital code
        break;
      default:
        break;
    }
  };
}

/** ********************************************
 *
 * @name validateEnigme
 * @param {*} id
 * @abstract method used to validate an enigme
 *
 * *********************************************/
function validateEnigme(id) {
  return (dispatch, getState) => {
    dispatch(updatePoint(100));
    dispatch({ type: VALIDATE_ENIGME, payload: { id } });
  };
}

/** ********************************************
 *
 * @name activateZone
 * @param {*} id
 * @abstract method used to validate an enigme
 *
 * *********************************************/
function activateZone(id, nextZoneId) {
  return dispatch => {
    dispatch(displayGeofenceById(nextZoneId));
    dispatch(updateIndiceAndPlayAudio(id));
  };
}

/***************** ENIGME 1 && RESET ZONE ********************/

/** ********************************************
 *
 * @name activateEnigme1
 * @abstract method used to activate an enigme 1
 *
 * *********************************************/
export function activateEnigme1() {
  return (dispatch, getState) => {
    // set locked variable to false in case someone forget it
    dispatch(resetEnigme1());
    dispatch(activateZone(zone.depart.enter, zone.enigme1.id));
  };
}

/** ********************************************
 *
 * @name resultEnigme1
 * @param {*} result - result given by the game central server
 * @abstract this method is used when the user enter the
 * first enigme code with the six colors
 *
 * ********************************************/
export function resultEnigme1(result) {
  return (dispatch, getState) => {
    /* 
      we need to check if the enigm is diplayed or not
      and if user has already been there
    */
    const geofence = dispatch(getGeofenceById(zone.enigme1.id));

    if (geofence.firstTimeIn) {
      // Enigme is visible and user been in the zone
      if (!geofence.validate) {
        //enigme is not validated
        if (!geofence.locked) {
          //the enigme is not locked or validated so we can treat the result
          const data = JSON.parse(result);
          if (data.result) {
            // result is true the first enigme is validated
            dispatch(validateEnigme(geofence.id));
            dispatch(activateEnigme2());
            //TODO add point
          } else {
            // result is false we lock again the enigme
            dispatch(lockEnigme1());
          }
        } else {
          //enigme is locked so we help the player
          dispatch(showToast(text.enigme1.locked, 3000, 'default'));
        }
      }
      //else {
      //engime is validated we do nothing
      //}
    }
  };
}

/** ********************************************
 *
 * @name lockEnigme1
 * @abstract this method is used when the user enter the
 * wrong code in enigme 1
 *
 * ********************************************/
export function lockEnigme1() {
  // activation of the reset zone
  return dispatch => {
    dispatch({ type: ENIGME_ONE_LOCKED });
    dispatch(updateFirstTimeIn(zone.enigme1.reset, false));
    dispatch(activateZone(zone.enigme1.locked, zone.enigme1.reset));
  };
}

/** ********************************************
 *
 * @name unlockEnigme1
 * @abstract when the user enter the reset area and
 * get the "key" from enigme 1
 *
 * ********************************************/
export function unlockEnigme1() {
  return dispatch => {
    dispatch(resetEnigme1());
    dispatch(updateIndiceAndPlayAudio(zone.enigme1.unlocked));
  };
}

/** ********************************************
 *
 * @name resetEnigme1
 * @abstract This method is called form unlockEnigme1 method
 * and is used to tell the server that the enigme 1 is unlocked
 *
 * ********************************************/
function resetEnigme1() {
  return dispatch => {
    dispatch({ type: ENIGME_ONE_UNLOCKED });
    dispatch(publishMqttMessage(topic.enigme.reset, text.enigme1.sendReset));
  };
}

/************* ENIGME 2 && NOISETIER ZONE *********************************/

/** ********************************************
 *
 * @name activateEnigme2
 * @abstract method used to activate an enigme 2
 *
 * *********************************************/
export function activateEnigme2() {
  return dispatch => {
    // play audio, display next zone and add point
    dispatch(activateZone(zone.enigme1.success, zone.enigme2.id));
  };
}

/** ********************************************
 *
 * @name activateNoisetierZone
 * @abstract method used to activate noisetier zone
 *
 * *********************************************/
export function activateNoisetierZone() {
  return dispatch => {
    dispatch(activateZone(zone.enigme2.enter, zone.enigme2.noisetier.id));
  };
}

/** ********************************************
 *
 * @name resultNoisetierZone
 * @param {*} result - result given by the game central server
 * @abstract this method is used when the user enter the
 * RFID key to save the noisetier
 *
 * ********************************************/
export function resultNoisetierZone(result) {
  return (dispatch, getState) => {
    /* 
      we need to check if the enigm is diplayed or not
      and if user has already been there
    */
    const geofence = dispatch(getGeofenceById(zone.enigme2.noisetier.id));
    if (geofence.firstTimeIn) {
      if (!geofence.validate) {
        //key is not validated
        const data = JSON.parse(result);
        if (data.result) {
          /* 
          when the key is recognized we reset enigme 2 zone
          to let user go back in a second time
          */
          dispatch(updateSecondTimeIn(zone.enigme2.id, false));
          dispatch(updateFirstTimeIn(zone.enigme2.id, false));
          dispatch(updateIndiceAndPlayAudio(zone.enigme2.noisetier.success));
          dispatch(validateEnigme(geofence.id));
        } else {
          // TODO just tell use that is the wrong key id
          dispatch(updateIndiceAndPlayAudio(zone.enigme2.noisetier.error));
        }
      } else {
        dispatch(showToast(text.validated, 3000, 'default'));
      }
    }
  };
}

/***************************** ENIGME 3 *************************************/

/** ********************************************
 *
 * @name activateEnigme3
 * @abstract method used to activate an enigme 3
 *
 * *********************************************/
export function activateEnigme3() {
  return dispatch => {
    dispatch(activateZone(zone.enigme2.success, zone.enigme3.id));
  };
}

/** ********************************************
 *
 * @name resultEnigme3
 * @param {*} result - result given by the game central server
 * @abstract this method is used when the user enter the
 * third enigme code with the six digits
 *
 * ********************************************/
export function resultEnigme3(result) {
  return dispatch => {
    const geofence = dispatch(getGeofenceById(zone.enigme3.id));
    if (geofence.firstTimeIn) {
      //TODO check code
      const data = JSON.parse(result);
      if (data.result) {
        // TODO display the finish dialog ans stop the game
        dispatch(playAudio(zone.enigme3.success));
        //Display the user success message and quit the game
        //Dialog success
        //Then quit and save point.
        dispatch(openCloseEndDialog());
      } else {
        // tell the user he entered the wrong key
        dispatch(playAudio(zone.enigme3.wrongkey));
      }
    }
  };
}

/**************************** GAME MANAGEMENT ***********************************/

/** ***************************************
 *
 * @name getGeofencesFromDb
 * @goal retrive the geofences from database
 *
 * ***************************************/
export function getGeofencesFromDb() {
  return (dispatch, getState) => {
    // Check if it's the best way to handle geofences request
    if (!getState().game.geofencesLoaded) {
      getGame('game').then(doc => {
        if (doc.exists) {
          return dispatch({
            type: GET_GEOFENCES,
            payload: { geofences: doc.data() }
          });
        }
      });
    }
  };
}

/** ***************************************
 *
 * @name updateIndiceAndPlayAudio
 * @param {*} id - id of the zone
 * @goal Change the indice and play audio
 * based on the user zone
 *
 * ***************************************/
function updateIndiceAndPlayAudio(id) {
  return dispatch => {
    dispatch(playAudio(id));
    dispatch(setIndice(id));
  };
}

/** ***************************************
 *
 * @name playAudio
 * @param {*} fileName - name of the audio file to play
 * @goal main function to play audio
 *
 * ***************************************/
function playAudio(fileName) {
  return (dispatch, getState) => {
    const { playingAudio } = getState().game;
    if (!playingAudio) {
      dispatch({ type: START_AUDIO });
      let yeah = new Sound(
        `${t(audio, fileName).safeObject}.mp3`,
        Sound.MAIN_BUNDLE,
        error => {
          if (error) {
            dispatch(showToast(`${text.audio.error.read}${fileName}`, 2000));
            dispatch({ type: STOP_AUDIO });
            return;
          }

          // Play the sound with an onEnd callback
          yeah.play(success => {
            if (!success) {
              dispatch(showToast(text.audio.error.play));
            }
            dispatch({ type: STOP_AUDIO });
          });
        }
      );
    }
  };
}

/*****************************************
 *
 * @name isPositionInCircle
 * @param {*} geofence - the geofence to check
 * @goal Check if user position is in the geofence
 * passed in paramters
 *
 * ***************************************/
function isPositionInCircle(geofence) {
  return (dispatch, getState) => {
    const region = getState().game.region;
    return isPointWithinRadius(
      {
        latitude: region.latitude,
        longitude: region.longitude
      },
      {
        latitude: geofence.latitude,
        longitude: geofence.longitude
      },
      geofence.radius
    );
  };
}

/** ***************************************
 *
 * @name updateGameInformation
 * @param {*} latitude
 * @param {*} longitude
 * @param {*} new_altitude
 * @param {*} speed
 * @goal take all parameters and update them
 * on the game screen
 *
 * ***************************************/
export function updateGameInformation(
  latitude,
  longitude,
  new_altitude,
  speed
) {
  return dispatch => {
    //update the distance
    dispatch(calculateDistance(latitude, longitude));
    //update altitude
    dispatch(updateAltitude(new_altitude)); //OK
    //update user position
    dispatch(updateUserPosition(latitude, longitude));
    //update the speed
    dispatch(calculateSpeed(speed)); //OK
  };
}

/** ***************************************
 *
 * @name updateAltitude
 * @param {*} new_altitude
 * @goal function used to calculate altitude changes
 *
 * *****************************************/
function updateAltitude(new_altitude) {
  return (dispatch, getState) => {
    //calcultate altitude diff
    const altitude = getState().game.altitude;
    let altitudeDiff;
    if (new_altitude !== 0) {
      if (altitude === 0) {
        //Because getCurrent position at init always get altitude 0
        return dispatch({
          type: INIT_ALTITUDE,
          payload: { altitude: new_altitude }
        });
      } else if (altitude > new_altitude) {
        //previous altitude is bigger so we are going down
        altitudeDiff = altitude - new_altitude;
        return dispatch({
          type: UPDATE_NEGATIVE_ALTITUDE,
          payload: { altitudeDiff, altitude: new_altitude }
        });
      } else if (altitude < new_altitude) {
        //previous altitude is smaller so we are going up
        altitudeDiff = new_altitude - altitude;
        return dispatch({
          type: UPDATE_POSITIVE_ALTITUDE,
          payload: { altitudeDiff, altitude: new_altitude }
        });
      }
    }
  };
}

/** *****************************************
 *
 * @name updateUserPosition
 * @param {*} latitude
 * @param {*} longitude
 * @goal update user position based on new lat / lng
 *
 * *****************************************/
function updateUserPosition(latitude, longitude) {
  return (dispatch, getState) => {
    return dispatch({
      type: UPDATE_REGION,
      payload: {
        latitude,
        longitude,
        routeCoordinates: { latitude, longitude }
      }
    });
  };
}

/** *****************************************
 *
 * @name calculateDistance
 * @param {*} newLatitude
 * @param {*} newLongitude
 * @goal take the new latitude and longitude and
 * calculate the distance from previous position
 *
 * *****************************************/
function calculateDistance(newLatitude, newLongitude) {
  return (dispatch, getState) => {
    const { latitude, longitude } = getState().game.region;
    //check this otherwise first distance is enormous
    if (latitude !== 0 && longitude !== 0) {
      const distance =
        haversine(
          { latitude: latitude, longitude: longitude },
          { latitude: newLatitude, longitude: newLongitude },
          { unit: 'meter' }
        ) || 0;
      return dispatch({
        type: UPDATE_SESSION_TOTAL_DISTANCE,
        payload: {
          distance
        }
      });
    }
  };
}

/** *****************************************
 *
 * @name getUserPosition
 * @param {*} callback - function to call when position is retrived
 * @goal ask the gps for the user position
 *
 * *****************************************/
export function getUserPosition(callback) {
  return dispatch => {
    RNLocation.checkPermission({
      android: {
        detail: 'fine' // or 'fine'
      }
    })
      .then(permissionOk => {
        if (permissionOk) {
          RNLocation.getLatestLocation({ timeout: 20000 })
            .then(position => {
              const { latitude, longitude } = position;
              return dispatch({
                type: INIT_USER_POSITION,
                payload: { latitude, longitude }
              });
            })
            .catch(rejected => {
              dispatch(
                showToast(
                  `Merci de vérifier les permissions et l'état du gps avant de continuer: ${JSON.stringify(
                    rejected
                  )}`,
                  4000,
                  'warning'
                )
              );
            });
        } else {
          callback();
        }
      })
      .catch(rejected => {
        dispatch(showToast(`${JSON.stringify(rejected)}`, 4000, 'warning'));
      });
  };
}

/** *****************************************
 *
 * @name calculateSpeed
 * @param {*} speed - speed recieved from gps informaiton
 * @goal update the current speed and average speed of the user
 *
 * *****************************************/
export function calculateSpeed(speed) {
  return (dispatch, getState) => {
    const { speed_index, speed_sum } = getState().game;
    let newIndex = speed_index + 1;
    let newSpeed_sum = speed_sum + speed;
    let newAverage_speed = newSpeed_sum / newIndex;
    return dispatch({
      type: UPDATE_SPEED,
      payload: {
        average_speed: newAverage_speed,
        speed,
        speed_index: newIndex,
        speed_sum: newSpeed_sum
      }
    });
  };
}

/***************************************
 *
 * @name getGeofenceById
 * @param {*} id id of the geofence
 * @goal Retrive the geofence by id
 *
 * *************************************/
export function getGeofenceById(id) {
  return (dispatch, getState) => {
    const geofence = getState().game.geofences.find(g => g.id === id);
    return geofence;
  };
}

/***************************************
 *
 * @name displayGeofenceById
 * @param {*} id id of the geofence
 * @goal display the geofence by id
 *
 * *************************************/
export function displayGeofenceById(id) {
  return (dispatch, getState) => {
    return dispatch({ type: DISPLAY_GEOFENCE, payload: { id } });
  };
}

/** ***************************************
 *
 * @name gameIsStarted
 * @goal Start the timer and game variable
 *
 * ***************************************/
export function gameIsStarted() {
  return dispatch => {
    dispatch(startTimer());
    return dispatch({ type: GAME_IS_STARTED });
  };
}

/** ***************************************
 *
 * @name gameIsStoped
 * @goal stop the timer and game variable
 *
 * ***************************************/
export function gameIsStoped() {
  return dispatch => {
    dispatch(stopTimer());
    return dispatch({ type: GAME_IS_STARTED });
  };
}

/** *****************************************
 *
 * @name setFirstTimeInToTrue
 * @param {*} index - index of the geofence
 * @goal set the variable FirstTimeIn of the geofence
 * passed in parameters, to avoid multiple entry
 *
 * *****************************************/
export function setFirstTimeInToTrue(index) {
  return (dispatch, getState) => {
    return dispatch({ type: UPDATE_GEOFENCE, payload: { index } });
  };
}

/** *****************************************
 *
 * @name updateFirstTimeIn
 * @param {*} id - id of the geofence
 * @param {*} bool - value of the first Time in variable
 * @goal Function used to update the value of the first time in
 * variable using the id (and not the index) of the geofence and
 * the new value of the variable
 *
 * *****************************************/
function updateFirstTimeIn(id, bool) {
  return dispatch => {
    return dispatch({
      type: UPDATE_FIRST_TIME_IN,
      payload: { id, value: bool }
    });
  };
}

/** *****************************************
 *
 * @name updateSecondTimeIn
 * @param {*} id - id of the geofence
 * @param {*} bool - value of the second Time in variable
 * @goal Function used to update the value of the second time in
 * variable using the id (and not the index) of the geofence and
 * the new value of the variable
 * second time in variable is used mainly in enigme 2
 *
 * *****************************************/
function updateSecondTimeIn(id, bool) {
  return dispatch => {
    return dispatch({
      type: UPDATE_SECOND_TIME_IN,
      payload: { id, value: bool }
    });
  };
}

/** *****************************************
 *
 * @name saveUserSession
 * @param {*} callback - method to call when the function is finished
 * @goal This method is called when the user exit/finish
 * the game, the session is saved in database
 *
 * *****************************************/
export function saveUserSession(callback) {
  return (dispatch, getState) => {
    //stop the timer before saving the session
    dispatch(stopTimer());
    let result = false;

    const {
      average_speed,
      positiveAltitude,
      negativeAltitude,
      distance,
      routeCoordinates,
      totalTime
    } = getState().game;

    if (routeCoordinates.length > 1 && distance > 0) {
      let points = dispatch(calculatePoints());

      let session = {
        routeCoordinates,
        totalTime,
        distance: _round(distance, 0),
        altitudeUp: positiveAltitude,
        altitudeDown: negativeAltitude,
        avgSpeed: average_speed,
        date: new firebase.firestore.Timestamp.fromDate(new Date()),
        totalPoint: _round(points, 0)
      };

      dispatch(updateSessions(session));
      result = true;
    }

    dispatch({ type: RESET_GAME });
    callback();

    return result;
  };
}

/** *****************************************
 *
 * @name updatePoint
 * @param {*} nbrOfPoints - number of point to be added
 * @goal add point when one enigme is validated
 *
 * *****************************************/
function updatePoint(nbrOfPoints) {
  return (dispatch, getState) => {
    dispatch({ type: UPDATE_TOTAL_POINT, payload: { points: nbrOfPoints } });
  };
}

/** *****************************************
 *
 * @name calculatePoints
 * @global Calculate the point of the user session
 * This method need to be updated with a better system
 * of calculation
 *
 * *****************************************/
function calculatePoints() {
  return (dispatch, getState) => {
    // distance is in meter
    // time is in seconds.
    // more time, less point
    // more distance, more point
    // find a ratio between point and distance.
    const { distance, time, totalPoint } = getState().game;
    const seconds = time / 3000;
    const dist = distance * 2;
    const point = dist / seconds;
    return _round(point + totalPoint, 0);
  };
}

/** *****************************************
 *
 * @name startTimer
 * @global Start the time of the game
 *
 * *****************************************/
function startTimer() {
  return dispatch => {
    const now = new Date().getTime();
    const timer = setInterval(
      () =>
        dispatch({
          type: UPDATE_TIMER,
          payload: {
            now: Date.now()
          }
        }),
      1000
    );
    dispatch({ type: TIMER_START, payload: { start: now, now: now, timer } });
  };
}

/** *****************************************
 *
 * @name stopTimer
 * @global stop the time of the game and reset
 *
 * *****************************************/
function stopTimer() {
  return (dispatch, getState) => {
    const { timer, time } = getState().game;
    const subZero = n => (n < 10 ? '0' + n : n);
    const duration = moment.duration(time);

    clearInterval(timer);
    dispatch({
      type: TIMER_STOP,
      payload: {
        totalTime: `${subZero(duration.minutes())}:${subZero(
          duration.seconds()
        )}`
      }
    });
  };
}

/** *****************************************
 *
 * @name openCloseIndicePopUp
 * @global Display indice during the game
 * to help the user
 *
 * *****************************************/
export function openCloseIndicePopUp() {
  return dispatch => {
    dispatch({ type: OPEN_CLOSE_INDICE });
  };
}

/** *****************************************
 *
 * @name openCloseEndDialog
 * @global display the dialog at the end of the game
 *
 * *****************************************/
export function openCloseEndDialog() {
  return (dispatch, getState) => {
    dispatch({ type: OPEN_CLOSE_END_DIALOG });
  };
}

/** *****************************************
 *
 * @name setIndice
 * @param {*} zone - id of the geofence zone
 * @goal in order to give the user a correct indice based
 * on is status in the game, we nee to update it during
 * the game base on the last zone he was.
 *
 * *****************************************/
function setIndice(zone) {
  return (dispatch, getState) => {
    dispatch({
      type: UPDATE_INDICE,
      payload: { indice: t(indice, zone).safeObject }
    });
  };
}

/***************** UTILITY AND DEBUG *********************/

/** *****************************************
 *
 * @name db
 * @goal utility method to retrive the firebase database
 *
 * *****************************************/
function db() {
  const db = firebase.firestore();
  return db;
}

/** *****************************************
 *
 * @name getGame
 * @param {*} document - name of the document
 * @goal utility method to retrive a document
 * in the database (Firebase)
 *
 * *****************************************/
function getGame(document) {
  return db()
    .doc(`game/${document}`)
    .get();
}

/** *****************************************
 *
 * @name _round
 * @param {*} value - value to round up
 * @param {*} decimals - number of decimals to round to
 * @goal take a decimal number and round it up
 *
 * *****************************************/
function _round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

// DEBUG PURPOSE ONLY
/** *****************************************
 *
 * @name updateGeofencesForDebug
 * @param {*} index - geofence index
 * @goal for debug purpose can validate a enigme without
 * fully doing it
 *
 * *****************************************/
export function updateGeofencesForDebug(index) {
  return dispatch => {
    dispatch(showToast(`value: ${index}`, 2000, 'primary'));
    dispatch({
      type: UPDATE_FIRST_TIME_IN,
      payload: { id: index, value: true }
    });
    dispatch({
      type: DISPLAY_GEOFENCE,
      payload: { id: index }
    });
    dispatch(validateEnigme(index));
  };
}
