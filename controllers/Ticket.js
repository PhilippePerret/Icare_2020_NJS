'use strict'

const path = require('path')
    , fs   = require('fs')

class Ticket {
  static traite(ticket_id){
    console.log("Ticket ID:", ticket_id)
    var ticket = new Ticket(ticket_id)
    if (ticket.exists()) {
      ticket.run()
    } else {
      // TODO Ici, il faudrait une procédure de surveillance pour
      // voir si ça n'est pas un hacker qui tente des choses…
    }
    return 'home' // pour le moment
  }

  constructor(ticket_id){
    this.id = ticket_id
  }

  // Joue le ticket
  run(){
    try {
      eval(this.code)
    } catch (e) {
      console.error("Une erreur est survenue : ", e)
    } finally {

    }
  }

  // Retourne true si le ticket existe
  exists(){
    return fs.existsSync(this.path)
  }
  get code(){
    if ( undefined === this._code ) {
      this._code = fs.readFileSync(this.path,'utf-8')
      // console.log("Code à évaluer par le ticket : ", this._code)
    }
    return this._code
  }
  get path(){
    return this._path || ( this._path = path.join(Icare.folderTickets,this.id) )
  }
}

module.exports = Ticket
