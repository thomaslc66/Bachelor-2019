/***************************************************************
 *
 * File      : mqttAction.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : mqtt communication action reducer
 *
 *********************************************************************/
import { MQTT_CONNECTED, REGISTER_MQTT_CLIENT } from "../types";
import {
  resultEnigme1,
  resultNoisetierZone,
  resultEnigme3
} from "./gameAction";
import topic from "../../utils/mqtt_topic";

/**************************************************************
 *
 * @name registerMqttClient
 * @param {*} client The MQTT client use later to call publish
 * @goal used to store the MQTT client in store for later uses
 *
 **************************************************************/
export function registerMqttClient(client) {
  return dispatch => {
    return dispatch({ type: REGISTER_MQTT_CLIENT, payload: { client } });
  };
}

/**************************************************************
 *
 * @name onMqttConnected
 * @param {*} callback The method to run when client is connected
 * @goal This method subscribe to all mqtt we need for the game
 *
 **************************************************************/
export function onMqttConnected(callback) {
  return (dispatch, getState) => {
    callback();
    const client = getState().mqtt.client;

    // results of all enigmas
    client.subscribe(topic.enigme.result, 0);
    client.subscribe(topic.enigme.locked, 0);
    client.subscribe(topic.enigme.unlocked, 0);
    //client.subscribe(topic.enigme2, 0);
    client.subscribe(topic.enigme3, 0);
    //special zones
    client.subscribe(topic.noisetier.result, 0);

    dispatch({ type: MQTT_CONNECTED });
  };
}

/**************************************************************
 *
 * @name onMqttConnected
 * @param {*} message The message recieved from the central server
 * @goal This method subscribe to all mqtt we need for the game
 *
 **************************************************************/
export function onMqttMessage(message) {
  return (dispatch, getState) => {
    if (getState().game.inGame) {
      switch (message.topic) {
        case topic.enigme.result:
          const result = message.data;
          dispatch(resultEnigme1(result));
          break;
        case topic.enigme2:
          // nothing is waited
          break;
        case topic.noisetier.result:
          const res = message.data;
          dispatch(resultNoisetierZone(res));
          break;
        case topic.enigme3:
          dispatch(resultEnigme3(message.data));
          break;
        default:
          break;
      }
    }
  };
}

/** ******************************************************************
 *
 * @name publishMqttMessage
 * @param {*} topic topic to publish to
 * @param {*} message message to publish
 * @goal function used to publish a message to a specific topic
 *
 * *******************************************************************/
export function publishMqttMessage(topic, message) {
  return (dispatch, getState) => {
    const client = getState().mqtt.client;
    client.publish(topic, message, 0, false);
  };
}
