'use strict'

/**
  FTTMail
  Gestion des mails dans les tests

  Rappel : en mode local, les mails ne sont pas envoyés, mais enregistrés
  dans un dossier temporaire (défini par config.folderMail dans les
  configurations de FrontTests)

**/

async function loadMail(){

  var mod = await import('./ExpectSubject.js')
  let ExpectSubject = mod.ExpectSubject

  /**
    Class MailSubject
    ----------------------
    Pour le test des mails

    Il faut bien comprendre qu'une instance MailSubjet n'est pas un mail,
    c'est un sujet d'assertion qui définit les paramètres à trouver dans
    les mails (instances Mail)
  **/
  class MailSubject extends ExpectSubject {
    test(){console.log("Mail-Subject chargé")}

    constructor(dmail){
      super()
      this.data = dmail
    }

    /**
      Produit un succès si un mail a été envoyé avec les données transmises
      à l'instanciation de cette instance.
    **/
    evaluateExistence(){
      FTTMail.getMailsWhoseMatch(this.data)
      var pass = this.mailsFound === 1
      new Assertion(
          pass
        , this.positive
        , {
            pos_success: `Un mail contient bien ${objet}`
          , neg_success: `Aucun mail ne contient ${objet}`
          , pos_failure: `Un mail devrait contenir ${objet} (manque ${lacks.join(', ')})`
          , neg_failure: `Aucun mail ne devrait contenir ${objet}`
          }
        ).evaluate(options)
    }

  }

}
loadMail()

class FTTMail {
  static test(){console.log("FFTMail est chargé.")}

  /**---------------------------------------------------------------------
    |
    |
    | MÉTHODES DE TESTS
    |
    |
    |
  **/

  /*
    @method Mail.sent(dmail, options)
    @description Produit un succès si un mail répondant aux données +dmail+ a été transmis. Il faut avoir, au préalable, chargé le nombre de mails voulus avec `Mail.getLastMails(nombre)`.
    @provided
      :dmail {Object} Table des données. {to:destinataire, from:expéditeur, text:contenu, html,contenu HTML, sent_before:date, sent_after:date, subject: Le sujet attendu}
      :options {Object} Les [options classiques des assertions](#options_assertions)
    @usage Mail.sent(to:'phil@atelier-icare.net', suject:"Une erreur est survenue")
   */
  static sent(dmail){
    new MailSubject(dmail).evaluateExistence()
  }

  static getLastMails(nombre){
    const my = this
    return new Promise((ok, ko) => {
      $.get(`/fttajax?meth=getLastMails&args[]=${nombre||1}`, function(ret){
        // console.log("Retour de : ", ret, typeof(ret))
        my.lastMails = JSON.parse(ret).map(dmail => new FTTMail(dmail))
        console.log("this.lastMails : ", my.lastMails)
        ok()
      })
    })
  }


  static getMailsWhoseMatch(dexpected) {
    const my = this
    return my.lastMails.filter( lastMail => lastMail.matches(dexpected))
  }

  /**
    Méthode fonctionnelle recevant "Quel qu'un <sonmail@chez.lui>" et
    retournant "sonmail@chez.lui"
  **/
  static getMailIn(fmail){
    let indexIn = fmail.lastIndexOf('<')
    if ( indexIn < 0) return fmail
    let indexOut = fmail.indexOf('>', indexIn)
    return fmail.substring(indexIn + 1, indexOut)
  }
  static get folder(){return FrontTests.config.folderMails}


  // ---------------------------------------------------------------------
  //    INSTANCE
  constructor(data){
    this.data = data
  }

  /**
    Retourne true si le mail correspond aux données transmises par +dexpect+
    qui est un object qui a été envoyé par exemple dans Mail.send(dexpect)
  **/
  matches(dexpect) {
    for ( var prop in dexpect ) {
      var expected = dexpect[prop]
      switch (prop) {
        case 'after':
          if ( this.timestamp < expected ){
            this.badProp = ['after', expected, this.timestamp]
            return false
          }
          break
        case 'before':
          if ( this.timestamp > expected ) {
            this.badProp = ['before', expected, this.timestamp]
            return false
          }
          break
        case 'to':
          let realToExpected = FTTMail.getMailIn(expected)
          if ( this.realTo !== realToExpected) {
            this.badProp = ['to', realToExpected, this.realTo]
            return false
          }
          break
        case 'from':
          let realFromExpected = FTTMail.getMailIn(expected)
          if ( this.realFrom !== realFromExpected) {
            this.badProp = ['from', realFromExpected, this.realFrom]
            return false
          }
          break
        case 'subject':
          var lack = this.strMatchesStr(this.subject, expected)
          if ( lack ) {
            this.badProp = ['subject', lack, this.subject]
            return false
          }
          break
        case 'text':
          var lack = this.strMatchesStr(this.text, expected)
          if ( lack ) {
            this.badProp = ['text', lack, this.text]
            return false
          }
          break
        case 'html':
          var lack = this.strMatchesStr(this.html, expected)
          if ( lack ) {
            this.badProp = ['text', lack, this.html]
            return false
          }
          break
      }
    }
  }

  /**
    Return undefined si +str+ contient tous les segments définis dans
    la liste Array +expects+ ou retourne le premier segment manquant.
    TODO Une option devrait permettre, plus tard, de retourner tous les
    segments manquant.
  **/
  strMatchesStr(str, expects){
    if ( ! Array.isArray(expects) ) expects = [expects]
    for ( var expect in expects ) {
      if ( str.match(expect) == null ) return expect
    }
    return
  }
  /**
    |
    |
    | TOUTES LES DONNÉES
    | (enregistrées dans le fichier temporaire)
    |
    |
  **/
  get to(){return this.data.to}
  get realTo(){return this._realto || ( this._realto = FTT.getMailIn(this.to))}
  get from(){return this.data.from}
  get realFrom(){return this._realfrom || (this._realfrom = FTT.getMailIn(this.from))}
  get subject(){return this.data.subject}
  get text(){return this.data.text}
  get html(){return this.data.html}
  get UUID(){return this.data.UUID}
  get timestamp(){return this.data.timestamp}
  get path(){return this.data.path}

}

window.FTTMail = FTTMail
