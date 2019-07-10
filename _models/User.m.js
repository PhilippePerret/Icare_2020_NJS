'use strict'

// const DB = require('../config/mysql')


class User {

  // L'utilisateur courant
  static get current(){ return this._current}
  static set current(v){this._current = v}

  // Retourne true s'il y a un user courant et que c'est un administrateur
  static admin(){
    return this.current && this.current.isAdmin
  }

  // Retourne true si l'user identifié est icarien
  // Pour utiliser `if User.icarien()` dans le code
  static icarien(){
    return this.current && this.current.isIcarien
  }

  /**
    Retourne l'instance User de l'icarien d'identifiant +user_id+
  **/
  static get(user_id, cb){
    var error
    cb(error, new User(user_id))
  }

  /**
    retourne les icariens et seulement les icariens, sous forme d'instances
    User
  **/
  static get allIcariens(){
    return this._allicariens
  }
  static async getAllIcariens(){
    var res = await DB.getAll('icare_users.users', '*', (rec) => {
      return parseInt(rec.options.substr(16,1),10) > 1 && parseInt(rec.options.substr(0,1),10) < 1
    })
    this._allicariens = res.map(duser => new User(duser))
    return this._allicariens
  }

  // ---------------------------------------------------------------------
  //  INSTANCE
  constructor(data){
    this.data = data
  }

  // toValue(){return `id=${this.id}`}
  // toString(){return `username=${this.username};id=${this.id}`}

  get id(){return this.data.id}
  get mail(){return this.data.mail}
  get pseudo(){return this.data.pseudo}
  get options(){return this.data.options}
  get sexe(){return this.data.sexe}
  get is_homme(){return this.sexe === 'H'}
  get is_femme(){return this.sexe === 'F'}
  get sessionId(){ return this.data.session_id}
  set sessionId(v){ this.data.session_id = v}
  get cpassword(){return this.data.cpassword}
  get salt(){return this.data.salt}

  // ---------------------------------------------------------------------
  //  Statut de l'icarien
  get isAdmin(){
    return this.bitOption(0) > 0
  }
  get isIcarien() { return this.statut > 1  }
  get isActif()   { return this.statut == 2 }
  get isEnPause() { return this.statut == 3 }
  get isInactif() { return this.statut == 4 }
  get isAncien()  { return this.statut == 5 }

  // True si l'icarien ne veut recevoir aucun mail du tout
  get noMails(){ return this.bitOption(17) === 1}

  get destroyed(){ this.bitOption(3) === 1}
  get mailConfirmed(){ return this.bitOption(2) === 1}

  // ---------------------------------------------------------------------
  //  Propriétés volatiles

  get grade(){ return this.bitOption(1) }
  get statut(){return this.bitOption(16)}

  // ---------------------------------------------------------------------
  //  Préférences volatiles

  get hideHeader(){return this.bitOption(20) === 1}
  get shareHistorique(){return this.bitOption(21) === 1}
  get notifyIfMessageFrigo(){return this.bitOption(22) === 1}
  get typeContactWithWorld()  {return this.bitOption(23)}
  get typeContactWithIcarien(){return this.bitOption(19)}

  // La redirection qu'il faut atteindre après l'identification
  get redirectionAfterLogin(){
    return User.REDIRECTIONS_AFTER_LOGIN[this.bitOption(18)].route || '/'
  }


  // ---------------------------------------------------------------------
  //  Méthodes d'helper

  get humanStatut(){
    return User.HUMAN_STATUTS[this.statut].hname
  }

  /**
    Retourne l'icarien sous forme de carte
  **/
  card(options) {
    return `
div.icare
  div.metadata
    span.pseudo ${this.pseudo}
    span.mail ${this.mail}
    `
  }
  // ---------------------------------------------------------------------
  //  Méthodes utiles à l'identification

  // On enregistre le numéro de session de l'user pour pouvoir le reconnaitre
  async setSession(session_uuid){
    // DB.query("UPDATE FROM users WHERE id = ?", [session_uid], 'icare_users')
    this.sessionId = session_uuid
    await DB.update('icare_users.users', this.id, {session_id: session_uuid})
  }

  // On vérifie que le mot de passe soit correct
  authenticatePassword(password){
    return require('crypto').createHash('md5')
            .update(`${password}${this.mail}${this.salt}`)
            .digest("hex") === this.cpassword
  }

  // ATTENTION = MÉTHODE DE CLASSE
  /**
    Méthode appelée par la route /login in POST
  **/
  static async existsAndIsValid(req, res, data, done) {
    // console.log("-> existsAndIsValid", data)
    let user_data = await DB.query("SELECT * FROM icare_users.users WHERE mail = ?", [data.mail])
    if ( user_data.length ){
      let user = new User(user_data[0])
      console.log("user = ", user)
      if ( user.authenticatePassword(data.password) ) {
        /**
          |
          | TOUT EST OK
          |
        **/
        await user.setSession(req.session.id.replace(/\-/g,'').substring(0,32))
        req.session.user_id     = user.id
        req.session.session_id  = user.sessionId
        req.flash('annonce', `Bienvenue à l'atelier, ${user.pseudo} !`)
        res.redirect(data.route_after || user.redirectionAfterLogin)
      } else {
        // LE MAIL A ÉTÉ TROUVÉ, MAIS LE MOT DE PASSE NE CORRESPOND PAS
        // done("Inconnu au bataillon", null)
        req.flash('error', "Je ne connais aucun icarien avec ce mot de passe. Merci de ré-essayer.")
        res.redirect('/login')
      }
    } else {
      // console.error("Je ne connais pas ce gugusse.")
      // LE MAIL N'A PAS ÉTÉ TROUVÉ
      req.flash('error', "Je ne connais aucun icarien avec ce mail. Merci de ré-essayer.")
      res.redirect('/login')
      // done("Inconnu au bataillon", null)
    }
  }

  // ---------------------------------------------------------------------
  //    Méthodes fonctionnelles
  bitOption(index){
    return parseInt(this.options.substr(index,1),10)
  }

// ---------------------------------------------------------------------
//  CONSTANTES STATIQUES


  /**
    Pour reconnecter l'user, if any, à chaque rechargement de page
  **/
  static async reconnect(req, res, next){
    // On regarde ici si l'user est défini et est correct
    if ( req.session.user_id ) {
      console.log("ID user à reconnecter : ", req.session.user_id)
      var ret = await DB.get('icare_users.users', parseInt(req.session.user_id,10))
      // Si l'id de session mémorisé est également à l'id de session de
      // l'utilisateur, c'est que tout va bien. On définit l'utilisateur courant
      if ( ret.session_id == req.session.session_id ) {
        User.current = new User(ret)
      }
    } else {
      // console.log("Aucun user n'est défini par req.session.user_id")
    }
    next()
  }

}

class Admin extends User {

}

User.HUMAN_STATUTS = {
  0: {hname: "En attente de validation"}
  , 1: {hname: "Icarien"}
  , 2: {hname: "Actif"}
  , 3: {hname: "En pause"}
  , 4: {hname: "Inactif"}
  , 5: {hname: "Ancien"}
}

User.REDIRECTIONS_AFTER_LOGIN = {
  0: {hname:'Accueil du site',         route:'/'},
  1: {hname:'Bureau de travail',       route:'/bureau'},
  2: {hname:'Profil',                  route:'/bureau/profil'},
  3: {hname:'Dernière page consultée', route:this.lastPage},
  // - ADMINISTRATEUR -
  7: {hname:'Aperçu Icariens',   route:'admin/overview',  admin:true},
  8: {hname:'Console',           route:'admin/console',   admin:true},
  9: {hname:'Tableau de bord',   route:'admin/dashboard', admin:true}
}

/**
  Distribut toutes les méthodes de User.controller (UserController) dans User
**/
// for ( var meth in User.controller ) {
//   if ( undefined === User[meth] ) {
//     User[meth] = User.controller[meth].bind(User.controller)
//   } else {
//     new Error(`Erreur systématique : la méthode "${meth}" (contrôleur) est déjà connue du modèle User. Il faut lui donner un autre nom.`)
//   }
// }
Object.assign(User, Sys.reqController('User'))


module.exports = User
