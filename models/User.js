'use strict'

const DB = require('../config/mysql')


class User {

  // L'utilisateur courant
  static get current(){ return this._current}
  static set current(v){this._current = v}

  static async existsAndIsValid(req, res, data, done) {
    // console.log("-> existsAndIsValid", data)
    let user_data = await DB.query("SELECT * FROM users WHERE mail = ?", [data.mail], 'icare_users')
    if ( user_data ){
      // console.log("Ce gugusse est ", user_data[0])
      let user = new User(user_data[0])
      if ( user.authenticatePassword(data.password) ) {
        await user.setSession(req.session.id.replace(/\-/g,'').substring(0,32))
        // done(null, user)
        req.session.user_id     = user.id
        req.session.session_id  = user.sessionId
        req.flash('annonce', `Bienvenue à l'atelier, ${user.pseudo} !`)
        res.redirect(`/bureau/home` /* TODO À RÉGLER EN FONCTION DES OPTIONS */)
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
  static get(user_id, cb){
    var error
    cb(error, new User(user_id))
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
  //  Méthodes utiles à l'identification

  // On enregistre le numéro de session de l'user pour pouvoir le reconnaitre
  async setSession(session_uuid){
    // DB.query("UPDATE FROM users WHERE id = ?", [session_uid], 'icare_users')
    console.log("Mettre le session id de user à ", session_uuid)
    this.sessionId = session_uuid
    await DB.update('icare_users.users', this.id, {session_id: session_uuid})
  }

  // On vérifie que le mot de passe soit correct
  authenticatePassword(password){
    return require('crypto').createHash('md5')
            .update(`${password}${this.mail}${this.salt}`)
            .digest("hex") === this.cpassword
  }
}

class Admin extends User {

}
module.exports = User
