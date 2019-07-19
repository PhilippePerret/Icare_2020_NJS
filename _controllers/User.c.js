'use strict'
/**
  Méthodes de contrôleur de User

  Note : elles sont insérées en bas du module User.c.js
**/
const UserCtrl = {

  /**
    Pour reconnecter l'user, if any, à chaque rechargement de page
  **/
  async reconnect(req, res, next){
    // On regarde ici si l'user est défini et est correct
    if ( req.session.user_id ) {
      // console.log("ID user à reconnecter : ", req.session.user_id)
      var ret = await DB.get('icare_users.users', parseInt(req.session.user_id,10))
      // Si l'id de session mémorisé est également à l'id de session de
      // l'utilisateur, c'est que tout va bien. On définit l'utilisateur courant
      if ( ret.session_id == req.session.session_id ) {
        req.user = new User(ret)
      }
    } else {
      // console.log("Aucun user n'est défini par req.session.user_id")
    }
    next()
  }

, checkAutorisation(req,res,next){
    if ( req.user ) {
      next()
    } else {
      Dialog.error("Désolé mais vous n'êtes pas autorisé à rejoindre cette section.")
      res.redirect('/auth/login')
    }
  }
  /**
    Barrière pour ne laisser passer que les administrateurs
  **/
, checkIsAdmin(req, res, next) {
    if ( User.currentIsAdmin(req) ) {
      next()
    } else {
      Dialog.action_required(`Désolé mais cette section est réservée à l'administration.`)
      if ( req.user ) {
        res.redirect('/')
      } else {
        res.redirect(`/auth/login?ra=${req.originalUrl}`)
      }
    }
  }
}
module.exports = UserCtrl
