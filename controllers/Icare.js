'use strict'

const path = require('path')
    , fs   = require('fs')

class Icare {
  /**
    |
    |
    | L'état de l'atelier
    |
    |
  **/
  // Pour savoir si on est en local ou sur l'atelier
  // Cette donnée est défini dans un middleware en testant 'request.headers.host'
  // qui vaut 'localhost:3000' en local.
  static get isLocalSite() { return this._islocalsite }
  static set isLocalSite(v){ return this._islocalsite = v }
  /**
    |
    |
    | Tous les chemins d'accès
    |
    |
  **/
  static get folderTickets(){
    return this._foldertickets || (this._foldertickets = path.join(this.folderTemp,'tickets'))
  }
  static get folderMails(){
    return (
      this._foldermails = this._foldermails || path.join(this.folderTemp, 'mails')
    )
    // return this._foldermails
  }
  static get folderCandidats(){
    if ( undefined === this._folderCandidats ) {
      this._folderCandidats = path.join(this.folderTemp, 'candidats')
      fs.existsSync(this._folderCandidats) || fs.mkdirSync(this._folderCandidats)
    }
    return this._folderCandidats
  }
  static get folderUploads(){
    if ( undefined === this._folderuploads ) this._folderuploads = path.join(APP_PATH,'uploads')
    return this._folderuploads
  }
  static get folderTemp(){
    if ( undefined === this._foldertemp) {
      this._foldertemp = path.join(APP_PATH, 'tmp')
      fs.existsSync(this._foldertemp) || fs.mkdirSync(this._foldertemp)
    }
    return this._foldertemp
  }
  static get folderTmp(){return this.folderTemp} // alias
}

module.exports = Icare
