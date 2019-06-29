'use strict'

const Validate = require('../Validate')
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
    try {
      Validate.token(req.session.token, req.body.token)
      console.log("tokens ok")
      Validate.pseudo(req.body.upseudo)
      console.log(`pseudo "${req.body.upseudo}" ok`)
      Validate.mail(req.body.umail)
      console.log(`mail "${req.body.umail}" ok`)
    } catch (e) {
      req.flash('error', `Votre candidature n'est pas valide :<br/>${e.message}`)
      return false
    }

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
    req.flash('notice', `Votre candidature est valide !`)
    return true
  }

}

module.exports = Signup
