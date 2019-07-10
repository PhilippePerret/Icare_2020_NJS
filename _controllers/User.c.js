'use strict'
/**
  Méthodes de contrôleur de User
**/
const UserCtrl = {
  checkAutorisation(req,res,next){
    if ( !User.current ) {
      req.flash('error', "Désolé mais vous n'êtes pas autorisé à rejoindre cette section.")
      res.redirect('/')
    } else {
      next()
    }
  }
}
module.exports = UserCtrl
