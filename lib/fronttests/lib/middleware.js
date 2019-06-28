'use strict'
const thispath  = require('path')
const thisfs    = require('fs')
const thisglob  = require('glob')

class FrontTests {
  // Méthode qui construit la liste des fichiers de tests pour la mettre
  // dans le fichier `__all_fronttests__.js` (pour le moment)
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
}


module.exports = async function(req,res,next){
  var action = req.params.action
  if ( FrontTests.outOfDate() || action == 'update') {
    FrontTests.buildTestsFilesList(res)
  } else {
    res.sendFile(thispath.resolve(__dirname+'/../html/frames.html'))
  }
    // Attention, il n'y a pas de `next()` ici, donc on ne va pas plus loin
}
