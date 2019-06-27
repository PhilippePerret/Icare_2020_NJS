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
  static success(msg){
    new Log(msg).notify()
  }
  static failure(msg){
    new Log(msg).warn()
  }
  static test(){
    var msg = new Log("Un message test.")
    msg.warn()
    msg.notify()
    msg.neutre()
    msg.blue()
  }
  static notify(msg){new Log(msg).notify()}
  static error(msg){new Log(msg).warn()}
  static reset(){this.console.innerHTML = ''}
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
    this.console.append(di)
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
blue()    { this.log('blue')  }

log(css){
  this.console.append(this.div(css))
}
div(css){
  var di = document.createElement('DIV')
  di.innerHTML = this.message
  di.className = css
  return di
}

get console(){return document.querySelector('#console')}
}
