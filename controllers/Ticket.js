'use strict'

const path    = require('path')
    , fs      = require('fs')
    , uuidv4  = require('uuid/v4');

class Ticket {

  /**
    Pour créer un nouveau ticket qui contiendra le code +code+
    @param {String} code Code à écrire dans le ticket
    @return {Ticket} Instance du ticket créée (avec notamment ticket.id)
  **/
  static create(code){
    var ticket_id = `${Number(new Date())}-${uuidv4().replace(/\-/g,'').substring(1,10)}`
      , ticket = new Ticket(ticket_id)
    ticket.code = code
    ticket.save()
    return ticket
  }

  static traite(ticket_id){
    // console.log("Ticket ID:", ticket_id)
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
      this.destroy()
    } catch (e) {
      console.error("Une erreur est survenue : ", e)
    } finally {

    }
  }

  // Pour détruire le ticket (après son exécution)
  destroy(){
    fs.unlinkSync(this.path)
  }

  // Pour enregistrer le ticket ou sa nouvelle valeur
  save(){
    fs.writeFileSync(this.path, this.code)
  }

  // Retourne true si le ticket existe
  exists(){
    return fs.existsSync(this.path)
  }
  get code(){
    if ( undefined === this._code ) {
      this._code = fs.readFileSync(this.path,'utf-8')
    }
    return this._code
  }
  set code(v){this._code = v} // à la création
  get path(){
    return this._path || ( this._path = path.join(Icare.folderTickets,this.id) )
  }
}

module.exports = Ticket
