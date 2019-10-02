/***************************************************************
 *
 * File      : text.js
 * Programm  : Bachelor
 * Society   : HEIG
 * Author    : Thomas Lechaire
 * Date      : Aug - Sept 2019
 * Goal      : All application texts
 *
 *********************************************************************/
const text = {
  audio: {
    error: {
      play: "Erreur audio: ",
      read: "Erreur de lecture, l'indice pourra vous aider"
    }
  },
  auth: {
    empty_email_form: "Merci de remplir l'email et le mot de passe",
    empty_register_form: "Merci de compléter totalement le formulaire",
    no_error: "Pas d'erreur",
    same_password_error: "Les mots de passe sont différents, merci de vérifier",
    user_error: "Problème de récupération de l'utilisateur",
    user_not_found: "Pas d'utilisateur de ce nom, merci de vous enregistrer",
    unknown: "Merci de vérifier votre connexion"
  },
  depart: {},
  dialog: {
    no: "NON",
    quit_title: "Quitter ?",
    yes: "OUI"
  },
  enigme1: {
    locked: "Trouvez la clef pour déverrouiller le boitier",
    sendReset: '{"reset": true}'
  },
  enigme2: {
    noisetier: {}
  },
  enigme3: {
    end:
      "Félicitation, votre aventure s'arrête ici. Vous avez terminé le jeu et pouvez être fière de vos efforts."
  },
  game: {
    error: "Erreur: "
  },
  login: {
    button: "SE CONNECTER",
    email: "Email",
    password: "Mot de passe",
    register: "Premier fois ? Merci de vous enregistrer ici ->"
  },
  map: {
    altitude: "Altitude : ",
    asc_altitude: "Altitude pos. : ",
    avg_speed: "Vitesse (moy.) : ",
    button_ok: "FERMER",
    duration: "Durée : ",
    dsc_altitude: "Altitude neg. :",
    distance: "Distance : ",
    finish: "Terminer",
    indice: "Indice",
    end_game: "Félicitations",
    km_hour: "km/h",
    meter: "m",
    points: "Points",
    position_unavaliable: "Impossible de récupérer votre position",
    quit:
      "Êtes vous sur de vouloir quitter le jeu ? L'ensemble de votre parcours sera enregistré.",
    speed: "Vitesse : "
  },
  profile: {
    buttonPositive: "Ok",
    buttonNegative: "Annuler",
    connection: {
      close: "Perte de connexion avec le server du jeu",
      error: "Erreur lors de la connexion au server du jeu"
    },
    error_avatar: "Problème durant la mise à jour de l'avatar",
    image_url: "Url de l'image",
    image: "Votre image a bien été modifiée",
    kilometers: "Kilometers",
    logout: "Quitter",
    no_email: "email@myemail.com",
    no_name: "Ajouter votre nom",
    no_sessions_avaliable: "Aucune session disponible",
    no_time: "??:??",
    play: "JOUER",
    points: "Points",
    sessions_historic: "Historique des sessions",
    update_gravatar: "Modifier gravatar",
    wait: "Merci d'attendre le chargement du jeu",
    zero: "0"
  },
  rationale: {
    buttonPositive: "Ok",
    buttonNegative: "Annuler",
    message:
      "La localisation est utilisée pour afficher votre position sur la carte",
    title: "Nous avons besoin d'accéder à votre position"
  },
  register: {
    confirm_password: "Confirmation",
    email: "Email",
    first_name: "Prénom",
    last_name: "Nom",
    password: "Mot de passe",
    title: "Inscription",
    validated: "ENREGISTRER"
  },
  sessions: {
    altitude: "Altitude : ",
    asc_altitude: "Altitude pos. : ",
    avg_speed: "Vitesse moyenne : ",
    duration: "Durée : ",
    distance: "Distance : ",
    dsc_altitude: "Altitude neg. :",
    km: "km",
    kmh: "km/h",
    m: "m",
    points: "Points: ",
    speed: "Vitesse : ",
    update_error: "Problème durant la sauvegarde de la sessions",
    workout: "Session "
  },
  validated: "Cette zone est déjà validé, continuer l'aventure"
};

export default text;
