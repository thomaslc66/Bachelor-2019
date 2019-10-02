/***************************************************************
 *
 * File      : storeCreator.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : Redux multiple store creator
 *
 *********************************************************************/
import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import AuthReducer from "../redux/reducers/authReducer";
import MqttReducer from "../redux/reducers/mqttReducer";
import GameReducer from "../redux/reducers/gameReducer";

// Redux store creation
const allReducers = combineReducers({
  mqtt: MqttReducer,
  auth: AuthReducer,
  game: GameReducer
});

export default () => {
  const store = createStore(allReducers, applyMiddleware(thunk));
  return store;
};
