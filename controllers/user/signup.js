'use strict'

// const Validate = require('../Validate') // NE SERT PLUS
// const Validator = require('../Validator')
const Validator = require('../../config/validator')
/**
  La Class Signup qui s'occupe de valider ou invalider l'inscription
**/

class Signup {

  // Appelée, par la méthode post de la route, elle retourne true si
  // l'inscription est conforme. Sinon, elle affiche les messages d'erreur.
  static async isValid(req, res){
    /**
      |
      |--- Ici on vérifie que les données soient valides
      |
    **/
    // On crée un validateur général qui permettra de n'avoir qu'une
    // instance de résultat avec les erreurs, les champs à montrer
    // modifiés, etc.
    let validator = new Validator(req, res)
    // Ici, on définit ce que le validateur doit vérifier
    // Mais on doit aussi lui donner les autres champs afin qu'il puisse en
    // connaitre les valeurs
    await validator.validate(
        ['token', 'pseudo', 'mail', 'password', 'presentation', 'motivation']
      , ['patronyme', 'extraits']
    )

    // console.log("Liste totale des erreurs à la fin du check : ", errors, errors.length)
    if ( validator.hasErrors() ) {
      req.flash('error', `Votre candidature n'est pas valide :<br/>${validator.humanErrorList}`)
      res.locals.validator = validator // pour montrer les champs
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
