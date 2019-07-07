'use strict'
/**
  File
  -------
  Gestion des fichiers et dossiers
**/

// Nombre maximum de millisecondes d'utilisation d'un fichier
const LOCK_TIMEOUT = 10000
const fs = require('fs')

class File {
  //

  /**
    Pour exécuter la fonction +fct+ sur le fichier +fpath+ locké
  **/
  static execWithLock(fpath, fct){

    // Pour pouvoir utilise 'this.write(code)' dans le code de la méthode
    // qui utilise execWithLock
    this.execWithLock.write = function(code){
      // console.log("Je dois écrire ça dans le fichier", code, fpath)
      fs.writeFileSync(fpath, code)
    }

    this.execWithLock.read = function(){
      return fs.readFileSync(fpath,'utf8')
    }

    // Stop infinite loop
    if ( this.nombreTries && this.nombreTries[fpath] > 20 ) {
      throw new Error(`J'ai essayé trop de fois d'atteindre le fichier ${fpath}`)
    } else {
      if ( undefined === this.nombreTries ) this.nombreTries = {}
      if ( undefined === this.nombreTries[fpath] ) Object.assign(this.nombreTries, {[fpath]: 0})
      ++ this.nombreTries[fpath]
    }

    if ( fs.existsSync(fpath) ) {
      if ( this.inUse(fpath) ) {
        return setTimeout(this.execWithLock.bind(this,fpath,fct), 300)
      }
    }

    // On le bloque
    this.use(fpath)

    this.nombreTries[fpath] = 0

    try {
      fct.call(this.execWithLock)
    } catch (err) {
      console.error(err)
    } finally {

      // On le débloque
      this.unuse(fpath)
    }

  }
  // Retourne true si le fichier de path +path+ est en cours d'utilisation
  static inUse(path) {
    if ( undefined === this.useds || undefined === this.useds[path] ) return false
    // On doit vérifier si ça ne fait pas trop longtemps qu'il est en
    // utilisation
    if ( Date.now() > this.useds[path].endAt ) {
      // Le fichier a été locké trop longtemps
      this.unuse(path)
      return false
    } else {
      // Le fichier est locké
      return true
    }
  }

  // Démarre l'utilisation du fichier/dossier de path +path+
  static use(path) {
    if ( undefined === this.useds ) this.useds = {}
    Object.assign(this.useds, {[path]: {path:path, startAt:Date.now(), endAt:(Date.now()+LOCK_TIMEOUT)}})
  }
  static unuse(path){
    this.useds[path] = undefined
    delete this.useds[path]
  }
}
module.exports = File
