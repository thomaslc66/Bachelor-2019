/***************************************************************
 *
 * File      : mqttReducer.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : mqtt reducer - manage the mqtt communication
 *
 *********************************************************************/
import {
  MQTT_CONNECTED,
  MQTT_DISCONNECTED,
  REGISTER_MQTT_CLIENT
} from "../types";

//initial state
const initialstate = {
  mqttConnected: false,
  client: null,
  broker: {
    host: "tlmz.myqnapcloud.com",
    protocol: "mqtt",
    port: 1883,
    user: "thomas.lechaire@heig-vd.ch",
    pass: "$HEIG$"
  }
};

function mqttReducer(state = initialstate, { type, payload, ...action }) {
  switch (type) {
    case MQTT_CONNECTED:
      return {
        ...state,
        mqttConnected: true
      };
    case MQTT_DISCONNECTED:
      return {
        ...state,
        mqttConnected: false
      };
    case REGISTER_MQTT_CLIENT:
      return {
        ...state,
        client: payload.client
      };
    default:
      return state;
  }
}

export default mqttReducer;
