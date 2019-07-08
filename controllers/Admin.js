'use strict'
const path = require('path')

// On a toujours besoin des données modules
const AbsModule = System.require('models/AbsModule')

const Admin = {

  /**
    |
    |
    | Sections
    |
    |
  **/

  async dashboard(request, response){
    // On relève les candidatures, notamment pour faire des objets
    // qui vont permettre d'avoir toutes les informations
    // Cf. la [Classe Candidat] plus bas dans le fichier
    var candidats = await this.candidatures()
    response.render('gabarit',{place:'admin',section:'dashboard', candidatures:candidats})
  }

, async icariens(request, response) {
    await  User.getAllIcariens()
    response.render('gabarit',{place:'admin',section:'icariens'})
  }

  /**
    |
    |
    | Sections virtuelles (comme le télécharment)
    |
    |
  **/

, download(request, response){
    var zip = require('express-zip')
    Dialog.annonce("Je dois télécharger les documents : " + request.query.zf)
    console.log("Je dois télécharger : ", request.query.zf)
    // var docs = request.query.zf.map(doc => {path: doc, name: doc})

    var docs = request.query.zf.map(doc => {
      var docpath = System.pathFor(`uploads/${doc}`)
      if ( fs.existsSync(docpath) ) {
        return {path: docpath, name: path.basename(doc)}
      } else {
        throw new Error("Ce document est introuvable : " + docpath)
      }
    })
    response.zip(docs, 'documents_presentation.zip')
  }

  /**
    |
    |
    | Méthodes fonctionnelles
    |
    |
  **/

, watchers(){
    return "<p>Marion nous prend la tête, mais on aime bien.</p>"
  }
, async candidatures(){
    if ( undefined === this._candidats ) {
      this._candidats = []
      var folders = glob.sync(`${Icare.folderCandidats}/*`)
      if ( folders.length ) {
        for ( var folder of folders ) {
          var candidat = new Candidat(require(path.join(folder,'udata.json')))
          // Une table avec toutes les données nécessaires à l'affichage
          var data_candidat = await candidat.getData()
          this._candidats.push(data_candidat)
        }
      } else {
        this._candidats = false
      }
    }
    return this._candidats
  }

, valider_candidature(request, response){
    let Signup = System.require('controllers/user/signup')
    await Signup.valider_candidature(request.query.id)
    redirect(request.route.path)
  }

, refuser_candidature(request, response){
    let Signup = System.require('controllers/user/signup')
    await Signup.refuser_candidature(request.query.id)
    redirect(request.route.path)
  }

}// Admin


/**
  Classe Candidat
**/
class Candidat {
  constructor(data){
    this.udata = data
  }

  async getData(){
    var dmodule = await this.module
    return {
        id: this.id
      , pseudo: this.pseudo
      , mail: this.mail
      , module: dmodule
      , presentation: this.presentationFilename
      , motivation: this.motivationFilename
      , extraits: this.extraitsFilename // ou rien
    }
  }

  /**
    |
    | Data fixes d'une candidature
    |
  **/
  get id(){return this._id || (this._id = this.udata.id)}
  get pseudo(){return this._pseudo || (this._pseudo = this.udata.pseudo)}
  get mail(){return this._mail||(this._mail = this.udata.mail)}
  get zipfile(){return this._zipfile||(this._zipfile = this.udata.zipfile)}
  get patronyme(){return this._patro||(this._patro = this.udata.patronyme)}
  get module_id(){return this._modid||(this._modid = parseInt(this.udata.module,10))}

  /**
    |
    | Data volatiles
    |
  **/

  get presentationFilename(){
    if ( undefined === this._prefilename ) {
      this._prefilename = path.basename(this.udata['presentation'].split('::')[1])
      console.log("this._prefilename = ", this._prefilename)
    }
    return this._prefilename
  }
  get motivationFilename(){
    if ( undefined === this._motfilename ) {
      this._motfilename = path.basename(this.udata['motivation'].split('::')[1])
      console.log("this._motfilename = ", this._motfilename)
    }
    return this._motfilename
  }
  get extraitsFilename(){
    if ( undefined === this._extfilename && this.udata['extraits'] ) {
      this._extfilename = path.basename(this.udata['extraits'].split('::')[1])
      console.log("this._extfilename = ", this._extfilename)
    }
    return this._extfilename
  }
  get module(){return this._module || (this._module = this.getModule())}
  // Retourne un 'e' si le candidat est une femme.
  get e_f(){ return this._e_f || (this._e_f = this.isFemme?'e':'') }
  get isFemme(){ return this.isfemme || ( this.isfemme = this.uData['sexe']=='F' ) }

  /**
    |
    |
    | Méthodes fonctionnelles
    |
    |
  **/
  async getModule(){ return await AbsModule.module(this.module_id, ['id','name'])}
}


module.exports = Admin
