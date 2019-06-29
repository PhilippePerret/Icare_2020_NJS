'use strict'
/**
  Les fabriques usuelles
**/

/*
  @method getAPseudo()
  @description retourne un pseudo aléatoire
  @usage let pseudo = getAPseudo()
 */
window.getAPseudo = function(){
  var n = `${Number(new Date())}`
    , len = n.length
  return `Pseudo${n.substring(len-10,len)}`
}
