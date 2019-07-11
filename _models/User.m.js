'use strict'

// const DB = require('../config/mysql')

const Watcher = Sys.reqModel('Watcher')

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
  static get all(){
    return this._all
  }
  /**
    Retourne la liste de tous les icariens, classés suivant la clé +sortKey+
    @param {String} sortKey Une clé de classement, soit existante comme par exemple
                            'status' qui met d'abord les icariens en activité,
                            puis ceux en pause, etc.
                            Soit une propriété comme la date d'inscription par
                            exemple.
  **/
  static async allSortedBy(sortKey) {
    console.log("-> User.allSortedBy", sortKey)
    var allIc = await this.getAll()
    switch (sortKey) {
      case 'status':
        // On doit classer les icariens de cette manière :
        // - les icariens en activité (clé 'actif')
        // - les icariens en pause (clé 'en_pause')
        // - les icariens à l'arrêt (clé 'inactif')
        // - les icariens supprimés (clé 'killed')

        // L'indice dans la liste +listes+ ci-dessous correspond à la
        // valeur de user.statut, sauf pour killed
        var listes = [
          [], // juste inscrit
          [], // validé mais en attente de démarrage
          [], // actif
          [], // en pause
          [], // inactif
          [], // ancien
          [], // killed (pas par le statut)
        ]

        for ( var icarien of allIc ) {
          if ( icarien.statut < 6 ) {
            listes[icarien.statut].push(icarien)
          } else { // killed
            listes[6].push(icarien)
          }
        }
        // Pour la clarté
        console.log("<- User.allSortedBy", sortKey)
        return {
            candidats:  listes[0] // impossible, maintenant
          , demarrage:  listes[1]
          , actifs:     listes[2]
          , en_pause:   listes[3]
          , inactifs:   listes[4]
          , anciens:    listes[5]
          , destroyed:  listes[6]
        }
      default:

    }
  }
  static async getAll(){
    console.log("-> User.getAll")
    var res = await DB.getAll('icare_users.users', '*', (rec) => {
      return parseInt(rec.options.substr(16,1),10) > 1 && parseInt(rec.options.substr(0,1),10) < 1
    })
    this._all = res.map(duser => new User(duser))
    console.log("User.all = ", this._all)
    console.log("<- User.getAll")
    return this._all
  }

  /**
    |
    |
    |   INSTANCE USER
    |
    |
    |
  **/

  constructor(data){
    this.data = data
  }

  // toValue(){return `id=${this.id}`}
  // toString(){return `username=${this.username};id=${this.id}`}

  get id(){return this.data.id}
  get mail(){return this.data.mail}
  set mail(v){this.data.mail = v}
  get pseudo(){return this.data.pseudo}
  get options(){return this.data.options}
  get sexe(){return this.data.sexe}
  get sessionId(){ return this.data.session_id}
  set sessionId(v){ this.data.session_id = v}
  get cpassword(){return this.data.cpassword}
  get salt(){return this.data.salt}
  set salt(v){return this.data.salt = v}

  // ---------------------------------------------------------------------
  //  Statut/état de l'icarien

  get is_homme(){return this.sexe === 'H'}
  get is_femme(){return this.sexe === 'F'}
  get isAdmin() { return this.bitOption(0) > 0 }
  get isIcarien() { return this.statut > 1  }
  get isActif()   { return this.statut == 2 }
  get isEnPause() { return this.statut == 3 }
  get isInactif() { return this.statut == 4 }
  get isAncien()  { return this.statut == 5 }
  // Renvoie true si l'icarien à un paiement à honnorer
  hasPaiement(){ return this.checkIfPaiement() }


  // True si l'icarien ne veut recevoir aucun mail du tout
  get noMails(){ return this.bitOption(17) === 1}

  get destroyed(){ this.bitOption(3) === 1}
  get mailConfirmed(){ return this.bitOption(2) === 1}

  // ---------------------------------------------------------------------
  //  Propriétés volatiles

  get grade() { return this.bitOption(1)  }
  get statut(){ return this.bitOption(16) }
  /**
    |
    | Retourne les watchers courant de l'icare
    @return {Array} Liste d'instances Watcher
    | -----------------------------------------
    @warning
      Il faut impérativement appeler la méthode 'await this.getWatchers()'
      avant de faire appel à cette propriété.
  **/
  get watchers(){ return this._watchers }
  // Retourne la liste des instances Watcher de l'user courant
  // Attention : bien noter que c'est une méthode, pas une propriété
  async getWatchers(){
    var res = await DB.getWhere('icare_hot.watchers', {user_id: this.id})
    this._watchers = res.map( dataW => new Watcher(dataW))
  }

  /**
    @return {Watcher} Le watcher du prochain paiement, s'il n'est pas
                      courant.
  **/
  get nextPaiement(){ return this._nextPaiement }


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
    return this.cryptedGivenPassword(password) === this.cpassword
  }

  // Retourne le mot de passe donné, crypté
  cryptedGivenPassword(password){
    return require('crypto').createHash('md5')
            .update(`${password}${this.mail}${this.salt}`)
            .digest("hex")
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
        Dialog.annonce(`Bienvenue à l'atelier, ${user.pseudo} !`)
        res.redirect(data.route_after || user.redirectionAfterLogin)
      } else {
        // LE MAIL A ÉTÉ TROUVÉ, MAIS LE MOT DE PASSE NE CORRESPOND PAS
        // done("Inconnu au bataillon", null)
        Dialog.error("Je ne connais aucun icarien avec ce mot de passe. Merci de ré-essayer.")
        res.redirect('/login')
      }
    } else {
      // console.error("Je ne connais pas ce gugusse.")
      // LE MAIL N'A PAS ÉTÉ TROUVÉ
      Dialog.error("Je ne connais aucun icarien avec ce mail. Merci de ré-essayer.")
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


  /**
    |
    |
    | private
    |
    | Cette partie contient toutes les méthodes qui servent à d'autres
    | méthodes publiques plus haut. Voir l'exemple avec la première, qui
    | permet de définir la propriété-méthode hasPaiement() de l'icarien.
    |
    |
  **/

  async hasPaiementFutur(){
    if ( undefined === this._nextPaiement ) await this.checkIfPaiement()
    return !!(this.nextPaiement instanceof(Watcher))
  }

  // Retourne true si l'icarien a un paiement à effectuer
  async checkIfPaiement(){
    await this.getWatchers()
    this._nextPaiement = null // pour savoir s'il est défini
    for ( var watcher of this.watchers ) {
      if ( watcher.processus === 'paiement' ) {
        // C'est peut-être un paiement dans le futur
        if ( watcher.triggered * 1000 < Date.now() ) {
          return true
        } else {
          // On enregistre le paiement comme prochain paiement futur
          this._nextPaiement = watcher
        }
      }
    }
    return false // pas de paiement pour le moment
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
