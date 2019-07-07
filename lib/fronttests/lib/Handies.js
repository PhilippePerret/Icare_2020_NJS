'use strict'

// Pour obtenir le numéro de ligne. Par exemple pour les tests
window.lineNumber = function(depth){
  depth = depth || 2
  var error
  try { throw Error('') } catch(err){ error = err}
  var trueLine = error.stack.split(/\r?\n/)[depth].split(':')
  trueLine = trueLine[trueLine.length - 2]
  return trueLine
}
