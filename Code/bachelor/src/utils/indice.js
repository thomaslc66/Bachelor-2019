/***************************************************************
 *
 * File      : indice.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : All game indice / help texts
 *
 *********************************************************************/
const indice = {
  depart: {
    enter: "Dirigez-vous vers la zone de la première énigme"
  },
  enigme1: {
    enter: "Trouvez le code de 6 couleurs dans l'ordre décroissant des ménhirs",
    locked:
      "Rendez-vous dans la zone pour récupérer la clef et déverouiller le boitier",
    unlocked: "Le boîtier est dévérouillé. Retourner dans la zone des menhirs.",
    success:
      "La zone suivante est affichée sur la carte. Rendez-vous à l'observatoire"
  },
  enigme2: {
    enter:
      "Trouvez la clef puis allez libérez le noisetier et retournez à l'observatoire déposer la clef",
    success:
      "Trouver le code de six chiffres, présent sur la mission: conserve de la grande caricée. Du lac à la moissonneusse batteuse.",
    noisetier: {
      enter: "Trouvez le noisetier et libérez le avec la clef",
      success: "Retournez à l'observatoire",
      error: "Mauvaise clef"
    }
  },
  enigme3: {
    enter: "Libérez le gardient grâce au code trouvé à l'observatoire"
  }
};

export default indice;
