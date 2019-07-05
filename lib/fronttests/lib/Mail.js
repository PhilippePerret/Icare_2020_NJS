'use strict'

/**
  FTTMail
  Gestion des mails dans les tests

  Rappel : en mode local, les mails ne sont pas envoyés, mais enregistrés
  dans un dossier temporaire (défini par config.folderMail dans les
  configurations de FrontTests)

**/
window.MAIL = '📧' // pour utiliser `Le ${MAIL} de candidature [etc.]`

let MailSubject

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
  MailSubject = class extends ExpectSubject {
    test(){console.log("Mail-Subject chargé")}

    constructor(dmail){
      super()
      this.data = dmail
    }

    /**
      Produit un succès si un mail a été envoyé avec les données transmises
      à l'instanciation de cette instance.
    **/
    evaluateExistence(options){
      var objet = "les données transmises" + inDivMasked(JSON.stringify(this.data))
      var lacks = [] // pour le moment
      this.mailsFound = FTTMail.getMailsWhoseMatch(this.data)
      console.log("this.mailsFound = ", this.mailsFound)
      var pass = this.mailsFound.length > 0
      new Assertion(
          pass
        , this.positive
        , {
            pos_success: `Un ✉️ contient bien ${objet}`
          , neg_success: `Aucun ✉️ ne contient ${objet}`
          , pos_failure: `Un ✉️ devrait contenir ${objet} (manque ${lacks.join(', ')})`
          , neg_failure: `Aucun ✉️ ne devrait contenir ${objet}`
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
  static sent(dmail, options){
    new MailSubject(dmail).evaluateExistence(options)
  }

  static getLastMails(nombre){
    const my = this
    return new Promise((ok, ko) => {
      $.get(`/fttajax?meth=getLastMails&args[]=${nombre||1}`, function(ret){
        // console.log("Retour de : ", ret, typeof(ret))
        my.lastMails = JSON.parse(ret).map(dmail => new FTTMail(dmail))
        // console.log("this.lastMails : ", my.lastMails)
        ok()
      })
    })
  }


  static getMailsWhoseMatch(dexpected) {
    const my = this
    var itMatches
    var reste = my.lastMails.filter( lastMail => {
      itMatches = lastMail.matches(dexpected)
      // console.log("itMatches = ", itMatches)
      return itMatches
    })
    // console.log("Reste le mail : ", reste)
    return reste
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
  Pour faire quelque chose avec la propriété qui a fait rejeter la condition
**/
set badProp(v) {
  // console.log("    Rejeté car : ", v)
  this._badProp = v
}
get badProp(){ return this._badProp}
  /**
    Retourne true si le mail correspond aux données transmises par +dexpect+
    qui est un object qui a été envoyé par exemple dans Mail.send(dexpect)
  **/
  matches(dexpect) {
    // console.log("Comparaison du mail ... avec les données ...", this.data, dexpect)
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
    // Si on arrive ici, c'est que toutes les conditions sont passées,
    // on renvoie un succès pour que le filtre garde le message.
    return true
  }

  /**
    Return undefined si +str+ contient tous les segments définis dans
    la liste Array +expects+ ou retourne le premier segment manquant.
    TODO Une option devrait permettre, plus tard, de retourner tous les
    segments manquant.
  **/
  strMatchesStr(str, expects){
    if ( ! Array.isArray(expects) ) expects = [expects]
    for ( var expect of expects ) {
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
  get realTo(){return this._realto || ( this._realto = FTTMail.getMailIn(this.to))}
  get from(){return this.data.from}
  get realFrom(){return this._realfrom || (this._realfrom = FTTMail.getMailIn(this.from))}
  get subject(){return this.data.subject}
  get text(){return this.data.text}
  get html(){return this.data.html}
  get UUID(){return this.data.UUID}
  get timestamp(){return this.data.timestamp}
  get path(){return this.data.path}

}

window.Mail = FTTMail
