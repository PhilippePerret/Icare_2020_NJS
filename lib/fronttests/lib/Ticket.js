'use strict'

window.Ticket = class extends ExpectSubject {
  static test(){console.log("Classe Ticket chargée avec succès")}

  /*
    @method (ticket_found) Ticket.exists(params)
    @description Produit un succès s'il existe un ticket répondant aux paramètres +params+
    @provided
      :params {Object} Table définissant les clé/valeurs à trouver dans le ticket.
    @usage Tickets.exists({code:"transforme"}) // produit un succès si le code d'un ticket contient "transforme"
  */
  static exists(params, options){
    var pass = false
    var ticket_found = null
    for ( var ticket of this.tickets ) {
      if ( ticket.matches(params) ) {
        ticket_found = ticket
        pass = true
        break
      }
    }
    var objet = JSON.stringify(params)
    new Assertion(
      pass, this.positive, {
          pos_success: 'Le ticket existe'
        , neg_success: 'Le ticket n’existe pas'
        , pos_failure: `Un ticket devrait exister avec les paramètres ${objet}`
        , neg_failure: `Aucun ticket ne devrait exister avec les paramètres ${objet}`
      }
    ).evaluate(options)
    return ticket_found
  }
  /**
    Pour récupérer tous les tickets qui répondent au filtre +filter+
    @param {Object} filter Le filtre
                      :after Number    Le ticket doit avoir été émis après
  **/
  static async getAll(filter){
    var tickets = await Ajax.send({meth:'getTickets', args: filter})
    tickets = JSON.parse(tickets)
    console.log("Tickets remontés de back end:", tickets)
    this.tickets = tickets.map(dticket => {
      var [tid, code] = dticket.split('::')
      return new Ticket(tid, code)
    })
    // console.log("this.tickets = ", this.tickets)
  }


  // ---------------------------------------------------------------------
  //  INSTANCE

  /**
    @param {String} id    L'identifiant du ticket, qui correspond à son nom
                          de fichier. C'est lui qu'on utilise dans l'url pour :
                          /tck/<id>
    @param {String} code  Le code du ticket, qui peut être du string simple
                          ou un objet JSON. C'est le premier caractère et
                          le dernier qui déteminent la nature.
  **/
  constructor(ticket_id, code){
    super()
    this.id   = ticket_id
    this.code = code
  }

  /**
    Retourne true si le ticket correspond aux paramètres +params+
  **/
  matches(params){
    for ( var prop in params ) {
      var expect = params[prop]
      switch (prop) {
        case 'code':
          if ( ! this.code.match(expect) ) return this.setBadValue('code', this.code, expect)
          break
        case 'after':
          if ( this.time < expect ) return this.setBadValue('after', this.time, expect)
          break
        case 'before':
          if ( this.time > expect ) return this.setBadValue('before', this.time, expect)
          break
        default:
          if ( this.data[prop] != expect ) return this.setBadValue(prop, this.data[prop], expect)
      }
    }
  }
  setBadValue(property, actual, expected){
    this.badReason = `Property "${property}" : expected "${expected}", actual ${actual}.`
    return false
  }

  get data(){
    if (undefined === this._data) {
      if (this.code.startsWith('{') && this.code.endsWith('}')) {
        this._data = JSON.parse(this.code)
      } else {
        this._data = this.code
      }
    }
    return this._data
  }

  get time(){
    if ( undefined === this._time ) {
      this._time = parseInt(this.id.split('-')[0],10)
    }
    return this._time
  }

}
