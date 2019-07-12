'use strict'

class Dialog {

  get pour_essayer(){
    return Pug.mixin(`
div.essai
  span Ceci est un texte à essayer.
    `)
  }

  init() { delete this._message }
  get message(){return this._message}
  set message(v){this._message = v}

  action_required(msg){
    this.addMessage(`<div class="action-required">${msg}</div>`)
  }
  annonce(msg){
    this.addMessage(`<div class="annonce">${msg}</div>`)
  }
  error(msg){
    this.addMessage(`<div class="error">${msg}</div>`)
  }

  /**
    Méthode pour ajouter le message +msg+
  **/
  addMessage(msg){
    // if ( undefined === this._messages ) this._messages = []
    // this._messages.push(msg)
    this.messages.push(msg)
    this.setSession()
  }

  get messages(){
    if (undefined === this._messages) this.getSession()
    return this._messages
  }

  /**
    Règle la session pour qu'elle contienne les messages
  **/
  setSession(){
    this.session.dialog_messages = JSON.stringify(this.messages)
  }
  /**
    On récupère les messages qui sont peut-être en session
  **/
  getSession(){
    if ( this.session.dialog_messages ) {
      this._messages = JSON.parse(this.session.dialog_messages)
      console.log("Messages en session = ", this._messages)
    } else {
      this._messages = []
      console.log("Pas de messages en session")
    }
  }
  /**
    |
    | Méthode principale appelée par la page pour afficher
    | les éventuels messages
    |
  **/
  flashMessages(){
    if ( this.hasMessages() ) {
      return '<div class="flash">' + this.getMessages() + '</div>'
    } else {
      return ''
    }
  }
  /**
    Après avoir écrit le message, on peut vider la session et réinitialiser
    la liste des messages
  **/
  flushSession(){
    delete this.session.dialog_messages
    this._messages = []
  }
  /**
    @return {Boolean} true s'il y a des messages à afficher.
  **/
  hasMessages() {
    return this.messages.length > 0
  }
  /**
    Méthode qui retourne les messages à afficher (et les supprime des tampons)
  **/
  getMessages(){
    let all_messages = this.messages.join('')
    this.flushSession()
    return all_messages
  }
}

module.exports = new Dialog()
