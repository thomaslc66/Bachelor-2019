/***************************************************************
 *
 * File      : mqtt_topics.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : All mqtt publish / subscribe topics
 *
 *********************************************************************/
const topic = {
  enigme: {
    result: "/server/phone/enigme/1/result",
    locked: "/server/phone/enigme/1/locked",
    unlocked: "/phone/server/enigme/1/unlocked",
    reset: "/phone/server/piUno/reset/all/button"
  },
  enigme2: "/server/phone/enigme/2/result",
  enigme3: "/server/phone/enigme/3/result",
  noisetier: {
    result: "/server/phone/noisetier/result"
  }
};

export default topic;
