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

/*
  @method getAEmail()
  @description retourne un email aléatoire valide
  @usage let email = getAEmail()
 */
 window.getAEmail = function(){
   var n = `${Number(new Date())}`
     , len = n.length
     , n = n.substring(len - 7, len)
  return `user${n}@chez.moi`
 }
