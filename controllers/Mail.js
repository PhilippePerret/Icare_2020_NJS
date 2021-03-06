'use strict'
/**
  Mon gestionnaire de mail
**/
const path  = require('path')
    , fs    = require('fs')
const DEFAULT_EMAIL = 'phil@atelier-icare.net'
const {SMTPClient}  = require('smtp-client')
const DATA_MAIL     = require('../private/secret/mail.js')

/**
  |
  |
  | Si elle existe, on charge la configuration des mails
  | propre à l'application courante
  |
  |
**/
let MAIL_CONFIG
const MAIL_CONFIG_PATH = path.resolve(__dirname,'../config/mail.js')
if (fs.existsSync(MAIL_CONFIG_PATH)){
  MAIL_CONFIG = require(MAIL_CONFIG_PATH)
  console.log("Configuration des mails : ", MAIL_CONFIG)
}


const SPACE = "\r\n\r\n\r\n"

class Mail {

  static async send(dataMsg){
    if ( this.mustSendMail() ) {
      await new Mail().send(dataMsg)
    } else {
      // On se contente d'enregistrer le mail
      fs.existsSync(this.folderTmp) || fs.mkdirSync(this.folderTmp)
      dataMsg.UUID || Object.assign(dataMsg, {UUID: this.getAUUID()})
      let pmail = path.join(this.folderTmp, `${dataMsg.UUID}.json`)
      Object.assign( dataMsg, {
          path: pmail
        , timestamp: Number(new Date())
      } )
      console.log("PAS D'ENVOI DE MAIL. J'enregistre les données du mail:", dataMsg)
      fs.writeFileSync(pmail, JSON.stringify(dataMsg))
    }
  }

  // Retourne un UUID unique pour le mail. En fait, c'est simplement la
  // date
  static getAUUID(){
    if ( undefined === this._imail ) this._imail = 0
    ++ this._imail
    return `${Number(new Date())}-${this._imail}`
  }
  /**
    Méthode qui retourne true si on doit envoyer les mails
    On doit les envoyer si :
      - on n'est pas en local (config.checkIfLocal(), défini dans les configs, retourne
        false)
      - on est en local mais config.sendEvenLocal retourne true
  **/
  static mustSendMail(){
    return !this.isLocal() || this.config.sendEvenLocal === true
  }

  /**
    Retourne true si on est en local.
    Pour pouvoir le définir, il faut définir la méthode de configuration
    qui retournera la valeur (config.checkIfLocal())
  **/
  static isLocal(){ return this.config.checkIfLocal() }

  static get folderTmp(){
    if (undefined===this._foldertmp) this._foldertmp = this.config.folderTmp()
    return this._foldertmp
  }
  // La configuration, qui peut être définie dans `config/mail.js`
  static get config(){
    if (undefined === this._config) this._config = {}
    return this._config
  }
  static set config(v){this._config = v}

  // Méthode qui prépare l'expression régulière de remplacement
  // des caractères spéciaux dans le sujet
  static prepareReg(){
    // Cf. http://www.fileformat.info/info/unicode/char/00f4/index.htm
    //     http://www.fileformat.info/info/unicode/category/Po/list.htm
    var hreplace = {
        'ç': 'A7' // -> =C3=A7
      , 'Ç': '87'
      , 'é': 'A9'
      , 'É': '89'
      , 'è': 'A8'
      , 'ê': 'AA'
      , 'ë': 'AB'
      , 'Ê': '8A'
      , 'à': 'A0'
      , 'â': 'A2'
      , 'æ': 'A6'
      , 'Â': '82'
      , 'Ô': '94'
      , 'ô': 'F4'
      , 'ö': 'B6'
      , 'Œ': ['C5','92']
      , 'œ': ['C5','93']
      , 'ù': 'B9'
      , 'û': 'BB'
      , 'ü': 'BC'
      , 'Ù': '99'
      , 'Û': '9B'
      , 'î': 'AE'
      , 'ï': 'AF'
      , '…': ['E2','80','A6']
    }
    var strReg = ""
    for ( var letter in hreplace ){
      var co = hreplace[letter]
      strReg += letter
      if ( typeof co === 'string' ) {
        co = `=C3=${co}`
      } else {
        co = co.map( oc => `=${oc}`).join('')
      }
      hreplace[letter] = co
    }
    this.regHashReplacement = hreplace
    this.regSpeciaux = new RegExp(`([${strReg}])`,'g')
  }
  // Méthode appelée par le replace pour remplacer les caractères
  // spéciaux du sujet (subject)
  static regFunction( match, ch ){
    return this.regHashReplacement[ch]
  }


  // ---------------------------------------------------------------------
  // INSTANCE

  connexion(){
    return new SMTPClient({
      host: DATA_MAIL['host'],
      port: DATA_MAIL['port']
    })
  }

  async send(dataMessage){
    const s = this.connexion()
    await s.connect();
    await s.greet({hostname: DATA_MAIL['host']}); // runs EHLO command or HELO as a fallback
    await s.authPlain({username: DATA_MAIL['auth']['user'], password: DATA_MAIL['auth']['pass']}); // authenticates a user
    await s.mail({from: DEFAULT_EMAIL}); // runs MAIL FROM command
    await s.rcpt({to: 'philippe.perret@yahoo.fr'}); // runs RCPT TO command (run this multiple times to add more recii)
    await s.data(this.fullMessage(dataMessage)); // runs DATA command and streams email source
    await s.quit(); // runs QUIT command
  }

  fullMessage(data){
    try {
      var add = this.addLines.bind(this)
      var _ = this.addLines.bind(this)

      const boundary = "----ICARE-BOUNDARY----"
          , fullBoundary = `--${boundary}`

      _('Return-Path', `<${data.from || DEFAULT_EMAIL}>`)
      // add('Date', `${new Date()}`)
      _('From', `<${data.from || DEFAULT_EMAIL}>`)
      _('To', `<${data.to || DEFAULT_EMAIL}>`)
      data.CC   && add('CC', `<${data.CC}>`)
      data.BCC  && add('BCC', `<${data.BCC}>`)
      _('Subject', this.formateSubject(data.subject))
      add('Content-Type', `multipart/alternative; boundary="${boundary}"`)
      add('Content-Transfer-Encoding','quoted-printable')
      add('Content-Language', 'fr-FR')
      add(SPACE)

      //
      // --- Partie en plain text ---
      //
      add(fullBoundary)
      add('MIME-Version', '1.0')
      add('Content-Type', 'text/plain; charset="utf-8"')
      add('Content-Transfer-Encoding', 'quoted-printable')
      add('Content-Disposition', 'inline')
      add('')
      add(data.text)
      add(SPACE)

      //
      // --- Partie HTML ---
      //
      add(fullBoundary)
      add('MIME-Version', '1.0')
      add('Content-Type', 'text/html; charset="utf-8"')
      add('Content-Transfer-Encoding', 'quoted-printable')
      add('Content-Disposition', 'inline')
      add('')
      add('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http=\r\n://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">')
      add('<html>')
      add(data.html || this.text2html(data.text))
      add('</html>')
      add(SPACE)

      add(`${fullBoundary}--`)

      // add('.')
      var finalMessage = this.lines.join("\r\n")
      // console.log(finalMessage)
      return finalMessage
    } catch (e) {
      console.error(e)
      return 'ERREUR'
    }
  }

  addLines(propOrLine, value){
    if (undefined === this.lines) this.lines = []
    if ( value ) {
      this.lines.push(`${propOrLine}: ${value}`)
    } else {
      this.lines.push(propOrLine)
    }
  }
  formateSubject(str){
    console.log("Str au départ : ", str)
    const my = this
    if ( Mail.config.subject_header ) str = `${Mail.config.subject_header}${str}`
    if ( undefined === Mail.regSpeciaux ) Mail.prepareReg()
    str = str.replace(Mail.regSpeciaux, Mail.regFunction.bind(Mail))
    str = `=?utf-8?Q?${str}?=`
    console.log("Str à la fin : ", str)
    return str
  }

  text2html(str){
    str = str.split("\n").map(line => `<p>${line}</p>`).join("\n")
    return str
  }
}

// On ajoute la configuration
MAIL_CONFIG && Object.assign(Mail.config, MAIL_CONFIG )

module.exports = Mail
