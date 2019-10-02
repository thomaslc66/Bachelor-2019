/***************************************************************
 *
 * File      : types.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : All reducer actions types
 *
 *********************************************************************/
// application action
export const DISPLAY_TOAST = "DISPLAY_TOAST";
// user action
export const AUTH_FAILURE = "AUTH_FAILURE";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const REGISTER = "REGISTER";
export const REGISTER_FAILURE = "REGISTER_FAILURE";
export const SAVE_USER = "SAVE_USER";
export const UPDATE_AVATAR = "UPDATE_AVATAR";
export const UPDATE_TOTAL_DISTANCE = "UPDATE_TOTAL_DISTANCE";
export const UPDATE_TOTAL_POINT = "UPDATE_TOTAL_POINT";
export const UPDATE_SESSIONS = "UPDATE_SESSIONS";

// game action
export const DISPLAY_GEOFENCE = "DISPLAY_GEOFENCE";
export const ENIGME_ONE_LOCKED = "ENGIME_ONE_LOCKED";
export const ENIGME_ONE_UNLOCKED = "ENGIME_ONE_UNLOCKED";
export const GET_GEOFENCES = "GET_GEOFENCES";
export const GAME_IS_STARTED = "GAME_IS_STARTED";
export const INIT_USER_POSITION = "INIT_USER_POSITION";
export const INIT_ALTITUDE = "INIT_ALTITUDE";
export const OPEN_CLOSE_END_DIALOG = "OPEN_CLOSE_END_DIALOG";
export const OPEN_CLOSE_INDICE = "OPEN_CLOSE_INDICE";
export const RESET_GAME = "RESET_GAME";
export const SAVE_DATA = "SAVE_DATA";
export const SECOND_TIME_IN = "SECOND_TIME_IN";
export const START_AUDIO = "START_AUDIO";
export const STOP_AUDIO = "STOP_AUDIO";
export const UPDATE_SPEED = "UPDATE_SPEED";
export const UPDATE_GEOFENCE = "UPDATE_GEOFENCE";
export const UPDATE_GEOFENCE_FOR_DEBUG = "UPDATE_GEOFENCE_FOR_DEBUG";
export const UPDATE_NEGATIVE_ALTITUDE = "UPDATE_NEGATIVE_ALTITUDE";
export const UPDATE_POSITIVE_ALTITUDE = "UPDATE_POSITIVE_ALTITUDE";
export const UPDATE_TIMER = "UPDATE_TIMER";
export const UPDATE_REGION = "UPDATE_REGION";
export const UPDATE_SECOND_TIME_IN = "UPDATE_SECOND_TIME_IN";
export const UPDATE_FIRST_TIME_IN = "UPDATE_FIRST_TIME_IN";
export const UPDATE_INDICE = "UPDATE_INDICE";
export const UPDATE_SESSION_TOTAL_DISTANCE = "UPDATE_SESSION_TOTAL_DISTANCE";
export const VALIDATE_ENIGME = "VALIDATE_ENIGME";

// mqtt action
export const MQTT_CONNECTED = "MQTT_CONNECTED";
export const MQTT_DISCONNECTED = "MQTT_DISCONNECTED";
export const REGISTER_MQTT_CLIENT = "REGISTER_MQTT_CLIENT";
export const TIMER_START = "TIMER_STRAT";
export const TIMER_STOP = "TIMER_STOP";
