'use strict'

/**
  FTTMail
  Gestion des mails dans les tests

  Rappel : en mode local, les mails ne sont pas envoyés, mais enregistrés
  dans un dossier temporaire (défini par config.folderMail dans les
  configurations de FrontTests)

**/

class FrontTestsMail {
  static test(){console.log("FFTMail est chargé.")}

  static async getLastMails(nombre){
    $.get(`/fttajax?meth=getLastMails&args[]=${nombre||1}`, function(ret){
      console.log("Retour de : ", ret, typeof(ret))
      ret = JSON.parse(ret)
      console.log("Retour dejsonnisé : ", ret, typeof(ret))
    })

  }

  static get folder(){return FrontTests.config.folderMails}


  // ---------------------------------------------------------------------
  //    INSTANCE
  constructor(data){
    this.data = data
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
  get from(){return this.data.from}
  get subject(){return this.data.subject}
  get text(){return this.data.text}
  get html(){return this.data.html}
  get UUID(){return this.data.UUID}
  get timestamp(){return this.data.timestamp}
  get path(){return this.data.path}

}

window.FTTMail = FrontTestsMail
