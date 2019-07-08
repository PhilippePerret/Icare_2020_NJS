'use strict'

const path  = require('path')
    , fs    = require('fs')

const System = {
  require(relpath){
    var fullpath = path.resolve(__dirname, `../${relpath}`)
    return require(fullpath)
  }

  // Retourne le chemin absolu du path relatif +relpath+ d'où qu'on le
  // demande.
, pathFor(relpath) {
    return path.resolve(__dirname, `../${relpath}`)
  }

, removeFolder(path){
    return new Promise( (ok,ko) => {
      glob(`${path}/*`, async (err, files) => {
        for ( var file of files ) {
          if ( fs.statSync(file).isDirectory() ){
            await this.removeFolder(file)
            fs.rmdir(file, err=>{if (err){throw Error(err)} })
          } else {
            fs.unlink(file, err=>{if (err){throw Error(err)}})
          }
        }
        fs.rmdir(path, err=>{if (err){throw Error(err)} })
        ok()
      })
    })
}
}

module.exports = System
