'use strict'
/**
  La Class Signup qui s'occupe de valider ou invalider l'inscription
**/

class Signup {

  // Appelée, par la méthode post de la route, elle retourne true si
  // l'inscription est conforme. Sinon, elle affiche les messages d'erreur.
  static isValid(req){
    /**
      |
      |--- Ici on vérifie les différents points
      |
    **/
    req.flash('error', "Votre inscription n'est pas valide.")
    return false
    /**
      |
      | -- On transmet la demande à l'administration (watcher ?)
      |
    **/

    /**
      |
      | -- On confirme la bonne marche de la candidature en envoyant
      |    le ou la postulante à la page de confirmation
      |
    **/
    return true
  }

}

module.exports = Signup
