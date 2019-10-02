/***************************************************************
 *
 * File      : zone.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : All zone id in game
 *
 *********************************************************************/
const zone = {
  depart: {
    id: "depart",
    enter: "depart.enter"
  },
  enigme1: {
    id: "enigme1",
    enter: "enigme1.enter",
    reset: "reset",
    locked: "enigme1.locked",
    unlocked: "enigme1.unlocked",
    success: "enigme1.success"
  },
  enigme2: {
    id: "enigme2",
    enter: "enigme2.enter",
    noisetier: {
      id: "noisetier",
      enter: "enigme2.noisetier.enter",
      success: "enigme2.noisetier.success",
      error: "enigme2.noisetier.error"
    },
    success: "enigme2.success"
  },
  enigme3: {
    id: "enigme3",
    enter: "enigme3.enter",
    success: "enigme3.success",
    wrongKey: "enigme3.wrongKey"
  }
};

export default zone;
