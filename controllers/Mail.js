'use strict'
/**
  Mon gestionnaire de mail
**/
const path = require('path')
const DEFAULT_EMAIL = 'phil@atelier-icare.net'
const {SMTPClient}  = require('smtp-client')
const DATA_MAIL     = require('../private/secret/mail.js')

const SPACE = "\r\n\r\n\r\n"

class Mail {

  static async send(message){
    (new Mail().send(message)).catch(console.error)
  }
  // /**
  //   Les données de connexion
  // **/
  // static get account(){
  //   if (undefined === this._account){
  //     const DATA_MAIL = require(path.join(APP_PATH,'private','secret','mail.js'))
  //     console.log("DATA_MAIL = ", JSON.stringify(DATA_MAIL))
  //     this._account = Object.assign({}, DATA_MAIL)
  //   }
  //   return this._account
  // }

  // ---------------------------------------------------------------------

  constructor(data){
    // data.from     || ( data.from    = DEFAULT_EMAIL )
    // data.to       || ( data.to      = DEFAULT_EMAIL )
    // data.subject  || ( data.subject = "(sans sujet)")
    //
    // this.data = data
    // // Si on les disptache :
    // // Version textuelle et html du mail
    // this.text = data.text
    // this.html = data.html
    // // Attachement ?
    // this.attachment = data.attachment || null
  }

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

    var add = this.addLines.bind(this)

    const boundary = "----ICARE-BOUNDARY----"
        , fullBoundary = `--${boundary}`

    add('Return-Path', `<${data.from || DEFAULT_EMAIL}>`)
    // add('Date', `${new Date()}`)
    add('From', `<${data.from || DEFAULT_EMAIL}>`)
    // add('MIME-Version', '1.0')
    add('To', `<${data.to || DEFAULT_EMAIL}>`)
    data.CC   && add('CC', `<${data.CC}>`)
    data.BCC  && add('BCC', `<${data.BCC}>`)
    add('Subject', data.subject)
    // add('Content-Type', 'text/plain; charset=us-ascii; format=flowed')
    add('Content-Type', `multipart/alternative; boundary="${boundary}"`)
    // add('Content-Transfer-Encoding','7bit')
    add('Content-Language', 'fr-FR')
    add(SPACE)

    // --- Partie en plain text ---
    add(fullBoundary)
    add('MIME-Version', '1.0')
    add('Content-Type', 'text/plain; charset="utf-8"')
    add('Content-Transfer-Encoding', 'quoted-printable')
    add('Content-Disposition', 'inline')
    add('')
    add(data.text)
    add(SPACE)

    // --- Partie HTML ---
    add(fullBoundary)
    add('MIME-Version', '1.0')
    add('Content-Type', 'text/html; charset="utf-8"')
    add('Content-Transfer-Encoding', 'quoted-printable')
    add('Content-Disposition', 'inline')
    add('')
    add('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http=\r\n://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">')
    add('<html>')
    add(data.html)
    add('</html>')
    add(SPACE)

    add(`${fullBoundary}--`)

    // add('.')
    var finalMessage = this.lines.join("\r\n")
    console.log(finalMessage)
    return finalMessage
  }

  addLines(propOrLine, value){
    if (undefined === this.lines) this.lines = []
    if ( value ) {
      this.lines.push(`${propOrLine}: ${value}`)
    } else {
      this.lines.push(propOrLine)
    }
  }
}

module.exports = Mail
