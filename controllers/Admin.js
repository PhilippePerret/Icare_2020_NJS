'use strict'
const path = require('path')

const Admin = {
  watchers(){
    return "<p>Marion nous prend la tête, mais on aime bien.</p>"
  }
, candidatures(){
    if ( undefined === this._candidats ) {
      this._candidats = []
      var folders = glob.sync(`${Icare.folderCandidats}/*`)
      if ( folders.length ) {
        for ( var folder of folders ) {
          var udata = require(path.join(folder,'udata.json'))
          this._candidats.push(udata)
        }
      } else {
        this._candidats = false
      }
    }
    return this._candidats
  }
}

module.exports = Admin
