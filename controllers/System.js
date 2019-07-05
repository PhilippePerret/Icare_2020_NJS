'use strict'

const path  = require('path')
    , fs    = require('fs')

const System = {
  require(relpath){
    var fullpath = path.resolve(__dirname, `../${relpath}`)
    console.log("fullpath : ", fullpath)
    return require(fullpath)
  }
}

module.exports = System
