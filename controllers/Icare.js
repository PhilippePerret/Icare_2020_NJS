'use strict'

const path = require('path')
    , fs   = require('fs')

class Icare {

  /**
    |
    | Les différents chemins d'accès
    |
    |
  **/
  static get folderCandidats(){
    if ( undefined === this._folderCandidats ) {
      this._folderCandidats = path.join(this.folderTemp, 'candidats')
      fs.existsSync(this._folderCandidats) || fs.mkdirSync(this._folderCandidats)
    }
    return this._folderCandidats
  }
  static get folderTemp(){
    if ( undefined === this._foldertemp) {
      this._foldertemp = path.join(APP_PATH, 'tmp')
      fs.existsSync(this._foldertemp) || fs.mkdirSync(this._foldertemp)
    }
    return this._foldertemp
  }
}

module.exports = Icare
