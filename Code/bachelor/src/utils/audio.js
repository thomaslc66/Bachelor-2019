/***************************************************************
 *
 * File      : audio.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : All audio file name
 *
 *********************************************************************/
const audio = {
  depart: {
    enter: "depart_enter"
  },
  enigme1: {
    enter: "enigme1_enter",
    locked: "enigme1_locked",
    unlocked: "enigme1_unlocked",
    success: "enigme1_success"
  },
  enigme2: {
    enter: "enigme2_enter",
    noisetier: {
      enter: "noisetier_enter",
      success: "noisetier_success",
      error: "noisetier_error"
    },
    success: "enigme2_success"
  },
  enigme3: {
    enter: "enigme3_enter",
    success: "enigme3_success",
    wrongKey: "enigme3_error"
  }
};

export default audio;
