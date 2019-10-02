/***************************************************************
 *
 * File      : authReducer.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : Authentication reducer - manage the auth state
 *
 *********************************************************************/
import {
  AUTH_FAILURE,
  LOGOUT_SUCCESS,
  REGISTER,
  REGISTER_FAILURE,
  SAVE_USER,
  UPDATE_AVATAR,
  UPDATE_TOTAL_DISTANCE,
  UPDATE_TOTAL_POINT,
  UPDATE_SESSIONS
} from "../types";

//initial state
const initialstate = {
  me: {
    uid: "-",
    level: 1,
    sessions: [],
    displayName: "No Name",
    totalPoint: 0,
    totalDistance: 0,
    email: "Add an email",
    photoURL:
      //Free image from needpix.com
      "https://storage.needpix.com/rsynced_images/question-39818_1280.png"
  },
  logged_in: false,
  register: false,
  register_button_text: "Register"
};

function authReducer(state = initialstate, { type, payload, ...action }) {
  switch (type) {
    case AUTH_FAILURE:
      return {
        ...state,
        loginErrorMessage: payload.error,
        loginErrorVisible: payload.errorVisible
      };
    case LOGOUT_SUCCESS:
      return {
        //reset to initial state to avoid null error
        ...initialstate
      };
    case REGISTER:
      return {
        ...state,
        register: true,
        register_button_text: "Validate"
      };
    case REGISTER_FAILURE:
      return {
        ...state,
        registerErrorMessage: payload.error,
        registerErrorVisible: payload.errorVisible
      };
    case SAVE_USER:
      return {
        ...state,
        me: payload.user
      };
    case UPDATE_AVATAR:
      return {
        ...state,
        me: { ...state.me, photoURL: payload.photoURL }
      };
    case UPDATE_TOTAL_DISTANCE:
      return {
        ...state,
        me: {
          ...state.me,
          totalDistance: payload.totalDistance + state.me.totalDistance
        }
      };
    case UPDATE_TOTAL_POINT:
      return {
        ...state,
        me: {
          ...state.me,
          totalPoint: payload.totalPoint + state.me.totalPoint
        }
      };
    case UPDATE_SESSIONS: {
      return {
        ...state,
        me: {
          ...state.me,
          sessions: [
            ...state.me.sessions,
            { ...payload.session, key: `${state.me.sessions.length}` }
          ]
        }
      };
    }
    default:
      return state;
  }
}

export default authReducer;
