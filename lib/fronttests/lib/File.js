'use strict'


window.File = class extends ExpectSubject {
  static test(){console.log("Classe File chargée avec succès.")}
  static get positive(){
    if ( undefined === this._positive ) this._positive = true
    return this._positive
  }
  static set positive(v){this._positive = v}
  static get not(){
    this.positive = false
    return this
  }
  /**
    |
    |
    | Toutes les méthodes de test
    |
    |
  **/
  static async exists(relpath, options){
    var file = this.newInstanceFile(relpath)
    var repo = await file.exists(options)
    return repo
  }

  static newInstanceFile(relpath){
    var file = new File(relpath)
    this.positive = true // le remettre toujours à true, mais c'est lourd…
    return file
  }

  // ---------------------------------------------------------------------
  //  INSTANCE

  constructor(relpath){
    super()
    this.path     = relpath
    this.positive = !!this.constructor.positive
  }

  async testeSiExiste(){
    return await Ajax.send({meth:'fileExists', args:{path:this.path}})
  }

  /*
    @method File.exists(path)
    @description Produit un succès si le fichier de chemin +path+ existe.
    @provided
      :path {String} Chemin relatif depuis la racine de l'application
   */
  async exists(options){
    var itry = 0, pass
    do {
      // console.log("Tentative ", itry)
      pass = await this.testeSiExiste()
    } while ( ++itry < 10 && (pass != this.positive) )
    var sujet = `Le fichier ${this.path}`
    new Assertion(
      pass,
      this.positive,
      {
          pos_success: `${sujet} existe bien.`
        , neg_success: `${sujet} n'existe pas`
        , pos_failure: `${sujet} devrait exister…`
        , neg_failure: `${sujet} ne devrait pas exister…`
      }
    ).evaluate(options)
  }
}
