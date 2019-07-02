'use strict'

const path = require('path')
    , fs   = require('fs')

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
        ['token', 'pseudo', 'mail', 'password', 'patronyme', 'presentation', 'motivation']
      , [ 'extraits']
    )

    // console.log("Liste totale des erreurs à la fin du check : ", errors, errors.length)
    if ( validator.hasErrors() ) {
      req.flash('error', `Votre candidature n'est pas valide :<br/>${validator.humanErrorList}`)
      res.locals.validator = validator // pour montrer les champs
      // console.log("ERRORS : ", errors_msgs)
      return false
    }
    // Sinon on continue

    console.log("req.body après validation : ", req.body)
    console.log("req.files après validation : ", req.files)

    /**

      S'il y a des fichiers envoyés, on les met dans req.body pour simplifier
      la création de l'utilisateur.

      Noter que les fichiers qui auraient été transmis avant, avec des erreurs
      dans le formulaire, se trouvent déjà dans le req.body, avec comme valeur
      "originalname::path"

    **/
    if ( req.files.length ) {
      for ( var dfile of req.files ) {
        Object.assign(req.body, {[dfile['fieldname']]: `${dfile['originalname']}::${dfile['path']}`})
      }
    }
    /**
      |
      |
      | --  On crée la candidature (un dossier)
      |
      |
    **/
    this.create(req.body)

    /**
      |
      | --  On transmet la demande à l'administration et on la confirme
      |     à l'utilisateur
      |
    **/
    this.sendMails()

    /**
      |
      | -- On confirme la bonne marche de la candidature en envoyant
      |    le ou la postulante à la page de confirmation
      |
    **/
    req.flash('notice', `Votre candidature est valide !`)
    return true
  }

/**
  Création de la candidature avec les données +uData+

  Note : au lieu de créer une enregistrement dans la base de données, on
  enregistre simplement le fichier dans un dossier temporaire de validation,
  avec les documents.
**/
static create(uData) {
  let folderCandidature = path.join(Icare.folderCandidats, uData['token'])
    , [name_presentation, src_presentation] = uData['presentation'].split('::')
    , [name_motivation, src_motivation] = uData['motivation'].split('::')
    , [name_extraits, src_extraits] = (uData['extraits']||'').split('::')
    , dst_presentation = path.join(folderCandidature, `presentation${path.extname(name_presentation)}`)
    , dst_motivation = path.join(folderCandidature, `motivation${path.extname(name_motivation)}`)
    , udata_file = path.join(folderCandidature, 'udata.json')

  // On crée le dossier de la candidature
  fs.mkdirSync(folderCandidature)

  // On copie les documents et les données dedans
  fs.copyFileSync(src_presentation, dst_presentation)
  fs.copyFileSync(src_motivation, dst_motivation)
  if ( src_extraits ) {
    let dst_extraits = path.join(folderCandidature, `extraits${path.extname(name_extraits)}`)
    fs.copyFileSync(src_extraits, dst_extraits)
  }
  fs.writeFileSync(udata_file, JSON.stringify(uData))
}

static sendMails(){
  // Mail à l'user pour lui confirmer son inscription
  // Mail à l'administration pour informer de l'inscription
}

} // /Signup

module.exports = Signup
