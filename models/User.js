'use strict'

const DB = require('../config/mysql')


class User {

  // L'utilisateur courant
  static get current(){ return this._current}
  static set current(v){this._current = v}

  static async existsAndIsValid(req, data, done){
    // console.log("-> existsAndIsValid", data)
    let user_data = await DB.query("SELECT * FROM users WHERE mail = ?", [data.mail], 'icare_users')
    if ( user_data ){
      // console.log("Ce gugusse est ", user_data[0])
      let user = new User(user_data[0])
      await user.setSession(req.session.id.replace(/\-/g,'').substring(0,32))
      done(null, user)
    } else {
      // console.error("Je ne connais pas ce gugusse.")
      done("Inconnu au bataillon", null)
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
  get pseudo(){return this.data.pseudo}
  get options(){return this.data.options}
  get sexe(){return this.data.sexe}
  get is_homme(){return this.sexe === 'H'}
  get is_femme(){return this.sexe === 'F'}
  get sessionId(){ return this.data.session_id}
  set sessionId(v){ this.data.session_id = v}
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
  validPassword(password){
    console.log("Je passe par la validation du passport.")
    return true
  }
}

class Admin extends User {

}
module.exports = User
