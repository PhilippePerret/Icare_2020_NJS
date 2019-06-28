'use strict'
const path = require('path')
module.exports = function(req,res,next){
  if ( req.query.ftt == 'true' || req.query.ftt == '1' ) {
    res.sendFile(path.resolve(__dirname+'/../html/frames.html'))
    // Attention, il n'y a pas de `next()` ici, donc on ne va pas plus loin
  } else {
    next()
  }
}
