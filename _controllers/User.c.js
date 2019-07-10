'use strict'
/**
  Méthodes de contrôleur de User
**/
const UserCtrl = {
  checkAutorisation(req,res,next){
    if ( User.current ) {
      next()
    } else {
      req.flash('error', "Désolé mais vous n'êtes pas autorisé à rejoindre cette section.")
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
      if ( User.current ) {
        req.flash('error', `Désolé mais cette section est réservée à l'administration.`)
        res.redirect('/')
      } else {
        req.flash('action', `Désolé mais cette section est réservée à l'administration. Merci de vous identifier.`)
        res.redirect(`/login?ra=${req.originalUrl}`)
      }
    }
  }
}
module.exports = UserCtrl
