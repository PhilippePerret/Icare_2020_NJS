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
}

module.exports = System
