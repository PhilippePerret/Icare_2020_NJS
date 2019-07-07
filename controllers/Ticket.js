'use strict'

const path    = require('path')
    , fs      = require('fs')
    , uuidv4  = require('uuid/v4');

class Ticket {

  /**
    Pour créer un nouveau ticket qui contiendra le code +code+
    Cf. le manuel
    @param {String|Object} code Code à écrire dans le ticket ou les données
    @return {Ticket} Instance du ticket créée (avec notamment ticket.id)
  **/
  static create(code){
    var ticket_id = `${Number(new Date())}-${uuidv4().replace(/\-/g,'').substring(1,10)}`
      , ticket = new Ticket(ticket_id)
    if ( typeof code !== 'string' ) code = JSON.stringify(code)
    ticket.code = code
    ticket.save()
    return ticket
  }

  /**
    Exécution du ticket (cf. le manuel)
  **/
  static traite(ticket_id){
    console.log(`--> Traitement du ticket ${ticket_id}`)
    var ticket = new Ticket(ticket_id)
    if (ticket.exists()) {
      return ticket.run() || 'home'
    } else {
      // TODO Ici, il faudrait une procédure de surveillance pour
      // voir si ça n'est pas un hacker qui tente des choses…
      return 'home' // pour le moment
    }
  }

  // ---------------------------------------------------------------------


  constructor(ticket_id){
    this.id = ticket_id
  }

  /**
    |
    |
    |   MÉTHODES D'EXÉCUTION
    |
    |
  **/
  // Joue le ticket
  run(){
    var res
    try {
      if ( this.data ) {
        res = this.runAsData()
      } else {
        res = this.runAsEvaluableCode()
      }
      res && this.destroy()
    } catch (e) {
      console.error("Une erreur est survenue : ", e)
    }
  }

  // La procédure adoptée lorsque le code du ticket est un simple code à
  // évaluer (pas un hash de données)
  runAsEvaluableCode(){
    eval(this.code)
    return true
  }
  // La procédure adoptée lorsque le code est un hash de données (JSON)
  // définissant notamment `required` et `code`
  runAsData(){
    let Required
    if ( this.data.required ){
      Required = System.require(this.data.required)
    } else {
      Required = window
    }
    // console.log("data ticket = ", this.data)
    return Required[this.data.method||this.data.function].bind(Required)(this.data)
  }

  /**
    |
    |
    |   MÉTHODES I/O
    |
    |
  **/
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

  /**
    |
    |
    |   HELPERS
    |
    |
  **/
  /**
    Retourne un lien à utiliser dans un mail avec le titre 'titre'
  **/
  link(titre, options){
    return `<a href="${App.url}/tck/${this.id}">${titre||'Jouer le ticket'}</a>`
  }

  /**
    |
    |
    |   DATA
    |
    |
  **/
  get code(){
    if ( undefined === this._code ) {
      this._code = fs.readFileSync(this.path,'utf-8').trim()
    }
    return this._code
  }
  set code(v){this._code = v} // à la création
  // Le ticket peut contenir seulement du code ou un hash de données
  get data(){
    if ( undefined === this._data ) {
      if ( this.code.startsWith('{') && this.code.endsWith('}') ){
        this._data = JSON.parse(this.code)
      } else {
        this._data = false
      }
    }
    return this._data
  }

  get path(){
    return this._path || ( this._path = path.join(Icare.folderTickets,this.id) )
  }
}

module.exports = Ticket
