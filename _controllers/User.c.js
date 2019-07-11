'use strict'
/**
  Méthodes de contrôleur de User
**/
const UserCtrl = {
  checkAutorisation(req,res,next){
    if ( User.current ) {
      next()
    } else {
      Dialog.error("Désolé mais vous n'êtes pas autorisé à rejoindre cette section.")
      res.redirect('/login')
    }
  }
  /**
    Barrière pour ne laisser passer que les administrateurs
  **/
, checkIsAdmin(req, res, next) {
    if ( User.admin() ) {
      next()
    } else {
      Dialog.action_required(`Désolé mais cette section est réservée à l'administration.`)
      if ( User.current ) {
        res.redirect('/')
      } else {
        res.redirect(`/login?ra=${req.originalUrl}`)
      }
    }
  }
}
module.exports = UserCtrl
