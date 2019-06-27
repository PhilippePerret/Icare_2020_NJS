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
  static success(msg){
    new Log(msg).notify()
  }
  // Marquer un échec
  static failure(msg){
    new Log(msg).warn()
  }

  // Supprimer le dernier texte affiché
  static removeLast(){
    var el = this.divMessages.querySelectorAll("div.message")[0]
    el.parentNode.removeChild(el)
  }

  static test(){
    var msg = new Log("Un message test.")
    msg.warn()
    msg.notify()
    msg.neutre()
    msg.blue()
  }
  static discret(msg){new Log(msg).discret()}
  static notify(msg){new Log(msg).notify()}
  static error(msg){new Log(msg).warn()}
  static reset(){
    this.divMessages.innerHTML = ''
    this.updateSuccessCount(0)
    this.updateFailureCount(0)
  }
  static add(msg, styOrClass){
    msg = msg.replace(/\n/g,'<br>')
    var di = document.createElement('DIV')
    di.innerHTML = msg
    if ( styOrClass ){
      if ( styOrClass.match(/;/) )
        di.setAttribute('style', styOrClass)
      else
        di.className = styOrClass
    }
    this.divMessages.append(di)
  }

  // Méthode qui indique le numéro de succès dans la console, en bas
  static updateSuccessCount(nombre){
    this.markSuccess.innerHTML = nombre
  }
  static updateFailureCount(nombre){
    this.markFailure.innerHTML = nombre
  }

  static get markSuccess(){return this.console.querySelector('#success-mark')}
  static get markFailure(){return this.console.querySelector('#failure-mark')}
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
  this.divMessages.append(this.div(css))
}
div(css){
  var di = document.createElement('DIV')
  di.innerHTML = this.message
  di.className = `message ${css}`.trim()
  return di
}

get divMessages(){return this.constructor.divMessages}
}
