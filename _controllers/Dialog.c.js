'use strict'

class Dialog {
  static init() { delete this._message }
  static get message(){return this._message}
  static set message(v){this._message = v}
  static action_required(msg){
    this.message = `<div class="action-required">${msg}</div>`
  }
  static annonce(msg){
    this.message = `<div class="annonce">${msg}</div>`
  }
  static error(msg){
    this.message = `<div class="error">${msg}</div>`
  }

  /**
    Méthode middleware qui, avant l'affichage, prend les messages enregistrés
    dans les flash et les mets en forme pour affichage.
  **/
  static dispatchFlash(req,res,next){
    this.init()
    var msg
    msg = req.flash('annonce')
    msg.length && this.annonce(msg.join(''))
    msg = req.flash('action_required')
    msg.length && this.action_required(msg.join())
    msg = req.flash('error')
    msg.length && this.error(msg.join())
    next()
  }
}

module.exports = Dialog
