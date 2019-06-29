'use strict'

/**
  Pour écrire les messages sous le textarea du code, comme si c'était une console.
  L'objet Log sera global
**/
export class Log {
  static start(){
    this.reset()
    var da = new Date()

    this.add(`Démarrage des tests - ${da.toLocaleString('fr-FR')}`)
    this.startAt = (new Date()).getTime()
  }
  static stop(){
    this.stopAt = (new Date()).getTime()
  }
  static get duree(){return Math.round(this.stopAt - this.startAt) / 1000}

  // marquer un succès
  static success(msg){ new Log(msg).notify() }
  // Marquer un échec
  static failure(msg){ new Log(msg).warn() }
  // Marquer un test en attente
  static pending(msg){ Log.add(`Pending: ${msg}`,null,'color:orange;')}

  // Supprimer le dernier texte affiché
  static removeLast(){
    var el = this.divMessages.querySelector("div.last")
    el.parentNode.removeChild(el)
  }

  static test(){
    var msg = new Log("Un message test.")
    msg.warn()
    msg.notify()
    msg.neutre()
    msg.blue()
  }
  static discret(msg) {new Log(msg).discret()}
  static notify(msg)  {new Log(msg).notify()}
  static error(msg)   {new Log(msg).warn()}
  static blue(msg)    {new Log(msg).blue()}
  static reset(){
    this.divMessages.innerHTML = ''
    this.updateSuccessCount(0)
    this.updateFailureCount(0)
  }

  /**
    La méthode principale qui écrit le texte dans la page

    IMPORTANT : cette méthode doit rester la seule qui écrit les messages
    Ça permet notamment de suivre le dernier message pour le supprimer.
  **/
  static add(msg, classes, styles){
    // Il faut enlever la class "last" au dernier message affiché
    const last = document.querySelector('div.last')
    last && last.classList.remove('last')
    msg = msg.replace(/\n/g,'<br>')
    var di = document.createElement('DIV')
    di.innerHTML = msg
    styles  && di.setAttribute('style', styles)
    classes && ( di.className = Array.isArray(classes)?classes.join(' '):classes)
    di.classList.add('last')
    this.divMessages.append(di)
  }

  // Méthode qui indique le numéro de succès dans la console, en bas
  static updateSuccessCount(nombre){
    this.markSuccess.innerHTML = nombre
  }
  static updateFailureCount(nombre){
    this.markFailure.innerHTML = nombre
  }
  static updatePendingCount(nombre){
    this.markPending.innerHTML = nombre
  }

  static get markSuccess(){return this.console.querySelector('#success-mark')}
  static get markFailure(){return this.console.querySelector('#failure-mark')}
  static get markPending(){return this.console.querySelector('#pending-mark')}
  static get divMessages(){
    if (undefined === this._divmessages) {
      this._divmessages = this.console.querySelector('#console-messages')
    }
    return this._divmessages
  }
  static get console(){return document.querySelector('#console')}

// ---------------------------------------------------------------------
//  Instance
constructor(message){
  this.message = message
}

warn()    { this.log('warning') }
notify()  { this.log('notice')  }
neutre()  { this.log('neutre')  }
blue()    { this.log('blue')    }
discret() { this.log('discret') }

log(css){
  var classes = ['message']
  css && classes.push(css)
  this.constructor.add(this.message, classes)
}

get divMessages(){return this.constructor.divMessages}
}
