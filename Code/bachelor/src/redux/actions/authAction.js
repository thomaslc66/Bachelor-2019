/***************************************************************
 *
 * File      : authAction.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : Authentication actions reducers
 *
 *********************************************************************/
import firebase from "react-native-firebase";
import {
  LOGOUT_SUCCESS,
  SAVE_USER,
  UPDATE_AVATAR,
  UPDATE_SESSIONS,
  UPDATE_TOTAL_POINT,
  UPDATE_TOTAL_DISTANCE
} from "../types";
import { Toast } from "native-base";
import text from "../../utils/text";

/** *******************************************************************
 *
 * @name logIn
 * @param {*} user
 * @goal method to check if user is signed in or registred on login
 *
 * ******************************************************************/
export function logIn(user) {
  return dispatch => {
    const { email, password } = user;
    if (email && password) {
      auth(email, password)
        .then(resultUser => {
          getUserFromDb(resultUser.user);
        })
        .catch(error => {
          if (error.code === "auth/user-not-found") {
            _showToast(text.auth.user_not_found, 3000);
          } else if (error.code === "auth/unknow") {
            _showToast(text.auth.unknown, 3000);
          } else {
            _showToast(`${text.game.error} ${error.message}`, 3000, "warning");
          }
        });
    } else {
      _showToast(text.auth.empty_email_form, 3000);
    }
  };
}

/** ********************************************************
 *
 * @name signIn
 * @param {*} email
 * @param {*} password
 * @goal method used to signIn when user is already registred
 *
 * *********************************************************/
function auth(email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

/** ********************************************************
 *
 * @name signIn
 * @param {*} email
 * @param {*} password
 * @goal method used to signIn the first time with firebase
 *
 * *********************************************************/
function signIn(email, password) {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
}

/** ********************************************************
 *
 * @name updateAvatar
 * @param {*} linkToPicture - an url to the new image
 * @param {*} uidd -
 * @goal Update the avatar of the profile
 *
 * *********************************************************/
export function updateAvatar(linkToPicture, uidd) {
  return (dispatch, getState) => {
    const { uid } = getState().auth.me;

    getUser(uid).then(doc => {
      if (!doc.exists) {
        _showToast(text.profile.error_avatar, 3000, "warning");
      } else {
        //update the user image
        db()
          .collection("users")
          .doc(uid)
          .update({ photoURL: linkToPicture });
        return dispatch({
          type: UPDATE_AVATAR,
          payload: { photoURL: linkToPicture }
        });
      }
    });
  };
}

/** *********************************************************
 *
 * @name updateSessions
 * @param {*} session - the new sessions to save
 * @goal update the user session list at the end of a training
 *
 * *********************************************************/
export function updateSessions(session) {
  return (dispatch, getState) => {
    //get the size of the sessions to use for the key attribute

    dispatch({ type: UPDATE_SESSIONS, payload: { session } });
    dispatch({
      type: UPDATE_TOTAL_POINT,
      payload: { totalPoint: session.totalPoint }
    });
    dispatch({
      type: UPDATE_TOTAL_DISTANCE,
      payload: { totalDistance: session.distance }
    });

    const { uid, sessions, totalDistance, totalPoint } = getState().auth.me;

    getUser(uid).then(doc => {
      if (!doc.exists) {
        _showToast(text.sessions.update_error, 3000, "warning");
      } else {
        // update the sessions
        // but also the total point and distance
        db()
          .collection("users")
          .doc(uid)
          .update({ sessions, totalDistance, totalPoint });
      }
    });
  };
}

/** *********************************************************
 *
 * @name db
 * @goal return the db
 *
 * *********************************************************/
function db() {
  const db = firebase.firestore();
  return db;
}

/** *********************************************************
 *
 * @name getUser
 * @param {*} uid
 * @goal return a user from db using uid
 *
 * *********************************************************/

function getUser(uid) {
  return db()
    .doc(`users/${uid}`)
    .get();
}

/** *********************************************************
 *
 * @name register
 * @param {*} user - The user we need to register
 * @goal register a new user
 *
 * *********************************************************/
export function register(user) {
  return (dispatch, getState) => {
    const { email, password, first_name, last_name } = user;
    const { valid, errorMessage } = validate(user);
    let defaultUser = getState().auth.me;

    if (valid) {
      signIn(email, password)
        .then(result => {
          const { email, uid } = result.user;

          //update the user
          defaultUser.displayName = `${first_name} ${last_name}`;
          defaultUser.email = email;
          defaultUser.uid = uid;

          db()
            .collection("users")
            .doc(uid)
            .set(defaultUser);
        })
        .catch(error => {
          _showToast(`${text.game.error} ${error.message}`, 3000, "warning");
        });
    } else {
      _showToast(`${text.game.error} ${errorMessage}`, 3000, "warning");
    }
  };
}

/** *********************************************************
 *
 * @name logout
 * @goal Trigger the logout of the user
 *
 * *********************************************************/
export function logout() {
  return dispatch => {
    firebase
      .auth()
      .signOut()
      .catch(error => _showToast(error.message, 2000));
  };
}

/** *********************************************************
 *
 * @name logout_success
 * @goal store the user authentification state in the store
 *
 * *********************************************************/
export function logout_success() {
  return dispatch => {
    dispatch({ type: LOGOUT_SUCCESS });
  };
}

/** ***************************************
 *
 * @name getUserFromDb
 * @param {*} user - The user we want to retrive from db
 * @goal get a user from the database
 * user has been check before
 *
 * ******************************************/
export function getUserFromDb(user) {
  return dispatch => {
    getUser(user.uid).then(doc => {
      if (doc.exists) {
        return dispatch({
          type: SAVE_USER,
          payload: { user: doc.data() }
        });
      } else {
        showToast(text.auth.user_error, 4000, "danger");
      }
    });
  };
}

/** ************************************************
 *
 * @name updateUser
 * @param {*} user - The user to update
 * @goal update a user in redux store
 *
 * ***********************************************/
export function updateUser(user) {
  return dispatch => {
    return dispatch({
      type: SAVE_USER,
      payload: { user }
    });
  };
}

/** *********************************************
 *
 * @name _showToast
 * @param {*} message - Message to show
 * @param {*} duration - Durattion of the message
 * @param {*} type - Type of Toast (Danger, Warning, Default, etc..)
 * @goal for all application use
 *
 * *********************************************/
export function showToast(message, duration, type) {
  return dispatch => {
    Toast.show({
      text: message,
      duration: duration,
      position: "top",
      type: type || "default"
    });
  };
}

/** *********************************************
 *
 * @name _showToast
 * @param {*} message - Message to show
 * @param {*} duration - Durattion of the message
 * @param {*} type - Type of Toast (Danger, Warning, Default, etc..)
 * @goal for internal use
 *
 * *********************************************/
function _showToast(message, duration, type) {
  Toast.show({
    text: message,
    duration: duration,
    position: "top",
    type: type || "default"
  });
}

/** *************************************************************
 *
 * @name validate
 * @param {*} user value from the register form
 * @goal This function validate the user password or empty form
 *
 * ***************************************************************/
function validate(user) {
  let validForm = { valid: true, errorMessage: text.auth.no_error };
  const { first_name, last_name, email, confirm_password, password } = user;
  if (first_name && last_name && email && confirm_password && password) {
    if (password !== confirm_password) {
      validForm.valid = false;
      validForm.errorMessage = text.auth.same_password_error;
    }
  } else {
    validForm.valid = false;
    validForm.errorMessage = text.auth.empty_register_form;
  }

  return validForm;
}
