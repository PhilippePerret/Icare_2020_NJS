'use strict'
const thispath  = require('path')
const thisfs    = require('fs')
const thisglob  = require('glob')
const uuidv1    = require('uuid/v1');

const EXT_TO_MIME = {
    '.doc':   'application/msword'
  , '.docx':  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  , '.html':  'text/html'
  , '.htm':   'text/html'
  , '.jpeg':  'image/jpeg'
  , '.jpg':   'image/jpeg'
  , '.js':    'application/javascript'
  , '.json':  'application/json'
  , '.md':    'text/markdown'
  , '.mmd':   'text/markdown'
  , '.odp':   'application/vnd.oasis.opendocument.presentation'
  , '.odt':   'application/vnd.oasis.opendocument.text'
  , '.png':   'image/png'
  , '.pdf':   'application/pdf'
  , '.ppt':   'application/vnd.ms-powerpoint'
  , '.rtf':   'application/rtf'
  , '.rtfd':  'application/rtfd'
  , '.txt':   'text/plain'
  , '.webp':  'image/webp'
  , '.xml':   'text/xml'
  , '.zip':   'application/zip'
}
class FrontTests {
  /**
    Méthode appelée à chaque chargement de la page
  **/
  static checkFields(req){
    console.log("checkFields/")
    console.log("req.body", req.body)
    console.log("req.files", req.files)
    console.log("/checkFields")
    for (var prop in req.body ) {
      var val = req.body[prop]
      if ( Array.isArray(val) && val[0] === 'faked-file-field') {
        const filename = val[1]
            , file_src = thispath.resolve(__dirname,`../__app_tests__/support/documents/${filename}`)
            , name_dst = `${uuidv1()}${thispath.extname(filename)}`
            , file_dst = thispath.resolve(__dirname,`../../uploads/${name_dst}`)
        // On s'assure que le fichier existe bien. Il faut que ce soit un des
        // type enregistrés
        if ( thisfs.existsSync(file_src) ) console.log("Ce fichier existe : ", file_src)
        else throw new Error("Ce fichier N'existe PAS : ", file_src)
        // Le fichier de référence existe, on le duplique
        thisfs.copyFileSync(file_src, file_dst)
        // req.body[prop] = thisfs.
        var dataFile = {
            fieldname: prop
          , originalname: filename
          , encoding: '7bit'
          , mimetype: EXT_TO_MIME[path.extname(filename).toLowerCase()] || 'application/octet-stream'
          , destination: 'uploads/'
          , filename: name_dst
          , path: `uploads/${name_dst}`
          , ftt: true // propre, pour indiquer que c'est FrontTests
        }
        // TODO : il faut copier le fichier dans le dossier des uploads
        console.log("dataFile = ", dataFile)
        req.files.push(dataFile)
        console.log("req.files = ", req.files)
      }
    }
  }
  // Méthode qui construit la liste des fichiers de tests pour la mettre
  // dans le fichier `lib/alltests.js` (pour le moment)
  static buildTestsFilesList(){
    // return new Promise((done,ko)=>{
    //   this.execBuildList(done)
    // })
    this.outOfDate() && this.execBuildList()
    // res.sendFile(thispath.resolve(__dirname+'/../html/frames.html'))
    res.redirect('/?ftt=1')
  }
  //
  /**
    Retourne true si le fichier de tous les tests doit être actualisé
    Il doit être actualisé quand :
      1. il n'existe pas
      2. sa date de création et inférieur à la date de dernière modification
         du dossier des tests. (ce dernier point est à vérifier)
  **/
  static outOfDate() {
    if ( ! thisfs.existsSync(this.path) ) return true
    return thisfs.statSync(this.path).ctimeMS < thisfs.statSync(this.testsFolder).ctimeMS
  }
  static execBuildList(done){
    if ( thisfs.existsSync(this.path) ) thisfs.unlinkSync(this.path)
    if ( thisfs.existsSync(this.testsFolder) ) {
      const regFolder = new RegExp(this.testsFolder.replace(/\//g,'\\/'))
      var list = {}
      console.log("Le dossier des tests existe : ", this.testsFolder)
      for ( var tfile of this.testsFileList ){
        var trelpath = tfile.replace(regFolder,'')
        console.log("Fichier : ", trelpath)
        var drelpath = trelpath.split(thispath.sep)
        var currentObj = list
        for ( var element of drelpath ){
          if ( element === '' ) continue
          if ( undefined === currentObj[element] ) Object.assign(currentObj, {[element]:{} })
          currentObj = currentObj[element]
        }
        // On prépare déjà l'objet qui servira à conserver les résultats
        Object.assign(currentObj,{
            fn:element // fn = filename
          , re: {f:0,s:0,p:0} // re = résultat f = failure, s = success, p = pending
        })
        // console.log("currentObj, element", currentObj, element)
      }
      // console.log("list : ", JSON.stringify(list))
      // thisfs.writeFile(this.path, JSON.stringify(list), done)
      const code = `export const testsList = ${JSON.stringify(list)}`
      thisfs.writeFileSync(this.path, code)
    } else {
      throw new Error("Impossible de trouver le dossier des tests. Vous devez créer le dossier : " + this.testsFolder)
    }
  }
  // Retourne la liste de tous les fichiers tests
  // Noter qu'on les prend tous
  static get testsFileList(){
    return thisglob.sync(thispath.join(this.testsFolder,'**/*.js'))
  }
  // Retourne le chemin au fichier contenant la liste des tests
  static get path(){ return thispath.resolve(__dirname, './alltests.js') }
  static get testsFolder(){ return thispath.resolve(__dirname, '../__app_tests__')}

  static async run(req,res,next){
    var action = req.params.action
    if ( FrontTests.outOfDate() || action == 'update') {
      FrontTests.buildTestsFilesList(res)
    } else {
      res.sendFile(thispath.resolve(__dirname+'/../html/frames.html'))
    }
      // Attention, il n'y a pas de `next()` ici, donc on ne va pas plus loin
  }
}


module.exports = FrontTests
