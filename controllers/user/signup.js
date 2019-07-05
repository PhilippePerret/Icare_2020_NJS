'use strict'

const path = require('path')
    , fs   = require('fs')

const Mail = require('../../controllers/Mail')

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
        ['token', 'pseudo', 'mail', 'password', 'patronyme', 'module', 'presentation', 'motivation']
      , [ 'extraits', 'sexe', 'naissance']
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
        if ( undefined === dfile['originalname'] ) {
          console.error(`dfile['originalname'] est indéfini pour la clé "${dfile['fieldname']}"`)
          console.error(`Note : req.body['${dfile['fieldname']}'], lui, vaut "${req.body[dfile['fieldname']]}"`)
        } else {
          Object.assign(req.body, {[dfile['fieldname']]: `${dfile['originalname']}::${dfile['path']}`})
        }
      }
    }
    /**
      |
      |
      | --  On crée la candidature (un dossier)
      |
      |
    **/
    let signup = await this.create(req.body)

    /**
      |
      | --  On transmet la demande à l'administration et on la confirme
      |     à l'utilisateur
      |     Note : ça se fait de façon asynchrone, sans retarder le chargement
      |     de la page, contrairement à la version avec `await` qui prend
      |     vraiment trop de temps.
      |
    **/
    // await signup.sendMails()
    signup.sendMails()
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
  let signup = new Signup(uData)
  signup.create()
  return signup
}


// ---------------------------------------------------------------------
//  INSTANCE SIGNUP
//  Pour gérer l'inscription en particulier
constructor(uData){
  this.uData = uData
}

/**
  Création du dossier complet de candidature
**/
create(){
  this.makeCandidatureFolder()
  this.copyCandidatureFiles()
  this.makeDataFile()
}

/**
  Envoi des messages de confirmation au candidat et d'information
  à l'administration.
**/
async sendMails(){
  // Mail à l'administration pour informer de l'inscription
  await Mail.send({
      to:'phil@atelier-icare.net'
    , subject:'Nouvelle candidature'
    , text: `Nouvelle candidature sur le site.\n\nID: ${this.uuid}`
  })
  // Mail à l'user pour lui confirmer son inscription
  await Mail.send({
      to: this.formatedMailTo
    , subject:'Votre candidature a été reçue'
    , text: `Bonjour,\n\nNous avons fait bonne réception de votre candidature à l’atelier Icare.\n\nVotre numéro d'enregistrement est le : ${this.uuid}.\n\nVous serez informé${this.e_f} très prochainement de la décision prise par Phil d’accepter votre candidature.`
  })
  // Mail à l'user pour qu'il confirme son mail
  await Mail.send({
      to: this.formatedMailTo
    , subject: 'Confirmation de votre adresse mèl'
    , text: `Bonjour ${this.uData.pseudo},\n\nMerci de confirmer votre mèl en cliquant sur le lien ci-dessous :\n\n<center><a href="http://www.atelier-icare.net?tck=12345678">Confirmer le mèl « ${this.uData.mail} »</a></center>`
  })
}

get formatedMailTo(){
  return this._formatedmailto || ( this._formatedmailto = `${this.uData.pseudo} <${this.uData.mail}>` )
}

/**
  Le token du formulaire, qui sert aussi d'identifiant pour la candidature
**/
get token(){ return this.uData['token'].replace(/-/g,'').toUpperCase()}
get uuid(){ return this.token }

// Retourne un 'e' si le candidat est une femme.
get e_f(){
  if ( undefined === this._e_f ) this._e_f = this.isFemme?'e':''
  return this._e_f
}
get isFemme(){
  if ( undefined === this.isfemme ) this.isfemme = this.uData['sexe']=='F'
  return this.isfemme
}

// Path au dossier candidature de l'élément +relpath+
pathTo(relpath){
  return path.join(this.folderCandidature,relpath)
}

get folderCandidature(){
  if (undefined === this._foldercandidature){
    this._foldercandidature = path.join(Icare.folderCandidats, this.token)
  }
  return this._foldercandidature
}

get uDataFile(){ return this.pathTo('udata.json') }

// On crée le dossier de la candidature
makeCandidatureFolder(){
  fs.mkdirSync(this.folderCandidature)
}

// Copie des documents de présentation dans le dossier de candidature
copyCandidatureFiles(){

  // Document de présentation
  let [name_pres, src_pres] = this.uData['presentation'].split('::')
  fs.copyFileSync(
    src_pres,
    this.pathTo(`presentation${path.extname(name_pres)}`)
  )

  // Lettre de motivation
  let [name_mot, src_mot]   = this.uData['motivation'].split('::')
  fs.copyFileSync(
    src_mot,
    this.pathTo(`motivation${path.extname(name_mot)}`)
  )

  // Extraits ?
  let [name_ext, src_ext]   = (this.uData['extraits']||'').split('::')
  if ( src_ext ) {
    let dst_ext = this.pathTo(`extraits${path.extname(name_ext)}`)
    fs.copyFileSync(src_ext, dst_ext)
  }
}

// Création du fichier qui contient toutes les informations
makeDataFile(){
  fs.writeFileSync(this.uDataFile, JSON.stringify(this.uData))
}

} // /Signup

module.exports = Signup
