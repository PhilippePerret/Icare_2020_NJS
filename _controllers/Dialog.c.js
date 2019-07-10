'use strict'

class Dialog {
  static init() { delete this._message }
  static get message(){return this._message}
  static set message(v){this._message = v}

  static action_required(msg){
    this.addMessage(`<div class="action-required">${msg}</div>`)
  }
  static annonce(msg){
    this.addMessage(`<div class="annonce">${msg}</div>`)
  }
  static error(msg){
    this.addMessage(`<div class="error">${msg}</div>`)
  }

  /**
    Méthode pour ajouter le message +msg+
  **/
  static addMessage(msg){
    // if ( undefined === this._messages ) this._messages = []
    // this._messages.push(msg)
    this.messages.push(msg)
    this.setSession()
  }

  static get messages(){
    if (undefined === this._messages) this.getSession()
    return this._messages
  }

  /**
    Règle la session pour qu'elle contienne les messages
  **/
  static setSession(){
    this.session.dialog_messages = JSON.stringify(this.messages)
  }
  /**
    On récupère les messages qui sont peut-être en session
  **/
  static getSession(){
    if ( this.session.dialog_messages ) {
      this._messages = JSON.parse(this.session.dialog_messages)
      console.log("Messages en session = ", this._messages)
    } else {
      this._messages = []
      console.log("Pas de messages en session")
    }
  }
  /**
    Après avoir écrit le message, on peut vider la session et réinitialiser
    la liste des messages
  **/
  static flushSession(){
    delete this.session.dialog_messages
    this._messages = []
  }
  /**
    @return {Boolean} true s'il y a des messages à afficher.
  **/
  static hasMessages() {
    return this.messages.length > 0
  }
  /**
    Méthode qui retourne les messages à afficher (et les supprime des tampons)
  **/
  static getMessages(){
    let all_messages = this.messages.join('')
    this.flushSession()
    return all_messages
  }
}

module.exports = Dialog
