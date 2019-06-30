'use strict'

const Validate = require('../Validate')
/**
  La Class Signup qui s'occupe de valider ou invalider l'inscription
**/

class Signup {

  // Appelée, par la méthode post de la route, elle retourne true si
  // l'inscription est conforme. Sinon, elle affiche les messages d'erreur.
  static async isValid(req){
    /**
      |
      |--- Ici on vérifie les différents points
      |
    **/
    var errs, errors = []
    errs = Validate.token(req.session.form_token, req.body.token)
    if ( errs ) errors.push(...errs)
    errs = await Validate.pseudo(req.body.upseudo)
    if ( errs ) errors.push(...errs)
    errs = await Validate.mail(req.body.umail, req.body.umail_confirmation)
    if ( errs ) errors.push(...errs)

    // console.log("Liste totale des erreurs à la fin du check : ", errors, errors.length)
    if ( errors.length ) {
      var errors_msgs = errors.map(err => err.error).join('<br/>')
      req.flash('error', `Votre candidature n'est pas valide :<br/>${errors_msgs}`)
      // console.log("ERRORS : ", errors_msgs)
      return false
    }
    // Sinon on continue

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
