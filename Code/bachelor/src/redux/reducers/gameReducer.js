/***************************************************************
 *
 * File      : gameReducer.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : Game reducer - manage the game state
 *
 *********************************************************************/
import {
  DISPLAY_GEOFENCE,
  ENIGME_ONE_LOCKED,
  ENIGME_ONE_UNLOCKED,
  GET_GEOFENCES,
  GAME_IS_STARTED,
  INIT_USER_POSITION,
  INIT_ALTITUDE,
  OPEN_CLOSE_END_DIALOG,
  OPEN_CLOSE_INDICE,
  RESET_GAME,
  SAVE_DATA,
  START_AUDIO,
  STOP_AUDIO,
  TIMER_START,
  TIMER_STOP,
  UPDATE_SECOND_TIME_IN,
  UPDATE_FIRST_TIME_IN,
  UPDATE_INDICE,
  UPDATE_TOTAL_POINT,
  UPDATE_GEOFENCE_FOR_DEBUG,
  UPDATE_NEGATIVE_ALTITUDE,
  UPDATE_POSITIVE_ALTITUDE,
  UPDATE_SPEED,
  UPDATE_GEOFENCE,
  UPDATE_SESSION_TOTAL_DISTANCE,
  UPDATE_REGION,
  UPDATE_TIMER,
  VALIDATE_ENIGME
} from '../types';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const ASPECT_RATION = width / height;

//initial state
const initialstate = {
  geofences: [
    //empty at first comment is for debug purpose only
    //start geofence 46.782878, 6.653347
    //clendy geofence 46.780681, 6.656571,
    //reset zone 46.7821472, 6.6556107
    //enigme 2 46.784037, 6.657030
    //enigme 2 chêne 46.783599, 6.655768
    //enigme 3 46.785932, 6.647616
  ],
  geofencesLoaded: false,
  routeCoordinates: [],
  positiveAltitude: 0,
  negativeAltitude: 0,
  distance: 0,
  speed: 0,
  speed_index: 0,
  speed_sum: 0,
  average_speed: 0,
  altitude: 0,
  region: {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.00222,
    longitudeDelta: 0.01 * ASPECT_RATION
  },
  playingAudio: false,
  inGame: false,
  isEndDialogOpen: false,
  timer: null,
  time: 0,
  now: 0,
  start: 0,
  totalTime: '00:00',
  isTimerStarted: false,
  totalPoint: 0,
  isPopUpIndiceOpen: false,
  indice: 'Démarrer le jeu. La Zone de départ est affichée sur la carte'
};

function gameReducer(state = initialstate, { type, payload, ...action }) {
  switch (type) {
    case DISPLAY_GEOFENCE:
      return {
        ...state,
        geofences: state.geofences.map((geofence, index) => {
          return geofence.id === payload.id
            ? { ...geofence, isVisible: true }
            : geofence;
        })
      };

    case ENIGME_ONE_LOCKED:
      return {
        ...state,
        geofences: state.geofences.map((geofence, index) => {
          return index === 1 ? { ...geofence, locked: true } : geofence;
        })
      };
    case ENIGME_ONE_UNLOCKED:
      return {
        ...state,
        geofences: state.geofences.map((geofence, index) => {
          return index === 1 ? { ...geofence, locked: false } : geofence;
        })
      };
    case GET_GEOFENCES:
      return {
        ...state,
        geofences: payload.geofences.geofences,
        geofencesLoaded: true
      };
    case GAME_IS_STARTED:
      return {
        ...state,
        inGame: !state.inGame
      };
    case OPEN_CLOSE_END_DIALOG:
      return {
        ...state,
        isEndDialogOpen: !state.isEndDialogOpen
      };
    case INIT_ALTITUDE:
      return {
        ...state,
        altitude: payload.altitude
      };
    case INIT_USER_POSITION:
      return {
        ...state,
        region: {
          ...state.region,
          latitude: payload.latitude,
          longitude: payload.longitude
        }
      };
    case OPEN_CLOSE_INDICE:
      return {
        ...state,
        isPopUpIndiceOpen: !state.isPopUpIndiceOpen
      };
    case RESET_GAME:
      return {
        ...initialstate
      };
    case SAVE_DATA:
      return {
        ...initialstate
      };
    case START_AUDIO:
      return {
        ...state,
        playingAudio: true
      };
    case STOP_AUDIO:
      return {
        ...state,
        playingAudio: false
      };
    case TIMER_START:
      return {
        ...state,
        isTimerStarted: true,
        start: payload.start,
        now: payload.now,
        timer: payload.timer
      };
    case TIMER_STOP:
      return {
        ...state,
        isTimerStarted: false,
        totalTime: payload.totalTime
      };
    case UPDATE_NEGATIVE_ALTITUDE:
      return {
        ...state,
        negativeAltitude: payload.altitudeDiff + state.negativeAltitude,
        altitude: payload.altitude
      };
    case UPDATE_POSITIVE_ALTITUDE:
      return {
        ...state,
        positiveAltitude: payload.altitudeDiff + state.positiveAltitude,
        altitude: payload.altitude
      };
    case UPDATE_GEOFENCE: //Update geofence on first passage
      return {
        ...state,
        geofences: state.geofences.map((geofence, index) => {
          return index === payload.index
            ? { ...geofence, firstTimeIn: true }
            : geofence;
        })
      };
    case UPDATE_GEOFENCE_FOR_DEBUG: //Update geofence for debug purpose only
      return {
        ...state,
        geofences: state.geofences.map((geofence, index) => {
          return index === payload.index
            ? { ...geofence, firstTimeIn: true, isVisible: true }
            : geofence;
        })
      };
    case UPDATE_INDICE:
      return {
        ...state,
        indice: payload.indice
      };
    case UPDATE_SESSION_TOTAL_DISTANCE:
      return {
        ...state,
        distance: payload.distance + state.distance
      };
    case UPDATE_TOTAL_POINT:
      return {
        ...state,
        totalPoint: state.totalPoint + payload.points
      };
    case UPDATE_FIRST_TIME_IN: //Update geofence on first passage
      return {
        ...state,
        geofences: state.geofences.map((geofence, index) => {
          return geofence.id === payload.id
            ? { ...geofence, firstTimeIn: payload.value }
            : geofence;
        })
      };
    case UPDATE_SECOND_TIME_IN: //Update geofence on second passage
      return {
        ...state,
        geofences: state.geofences.map((geofence, index) => {
          return geofence.id === payload.id
            ? { ...geofence, secondTimeIn: payload.value }
            : geofence;
        })
      };
    case UPDATE_SPEED:
      return {
        ...state,
        speed: payload.speed,
        speed_index: payload.speed_index,
        speed_sum: payload.speed_sum,
        average_speed: payload.average_speed
      };
    case UPDATE_REGION:
      return {
        ...state,
        routeCoordinates: [...state.routeCoordinates, payload.routeCoordinates],
        region: {
          ...state.region,
          latitude: payload.latitude,
          longitude: payload.longitude
        }
      };
    case UPDATE_TIMER:
      return {
        ...state,
        now: payload.now,
        time: payload.now - state.start
      };
    case VALIDATE_ENIGME:
      return {
        ...state,
        geofences: state.geofences.map((geofence, index) => {
          return geofence.id === payload.id
            ? { ...geofence, validate: true }
            : geofence;
        })
      };
    default:
      return { ...state };
  }
}

export default gameReducer;
