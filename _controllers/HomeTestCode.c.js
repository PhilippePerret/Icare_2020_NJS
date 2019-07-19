'use strict'
/**
  Module destiné à tester du code sur la page d'accueil, pour
  simplifier certains essai.

  La propriété HomeTestCode.resultat doit retourner le code à
  imprimer en haut de la page d'accueil (if any)

  C'est la méthode HomeTestCode.test qui est appelée
**/
const HomeTestCode = {
  resultat: ''
  // Méthode principale appelée.
, async test(){
    // const my = this
    // const Ejs = require('ejs')
    // var travail, data
    // this.resultat = ""
    // var user = {pseudo: 'Ma Marion'}
    // for ( var etape_id = 10 ; etape_id < 20 ; etape_id ++ ){
    //   data = await DB.get('icare_modules.absetapes', etape_id)
    //   if ( undefined === data ) continue // un trou
    //   try {
    //     travail = Ejs.render(data.travail, {
    //         user: user
    //       , link_narration: "[[un lien vers Narration]]"
    //       , travail_type: my.travail_type.bind(my)
    //     })
    //   } catch (e) {
    //     console.error(e)
    //     this.resultat = `
    //     <div class="warning">ERREUR AVEC L'ÉTAPE ${etape_id}</div>
    //     <div class="warning">${e}</div>
    //     <div class="warning">CODE BRUT :</div>
    //     <div>${data.travail}</div>
    //     ${this.resultat}
    //     `
    //     return
    //   }
    //   console.log("----- data = ", data)
    //   this.resultat +=  travail + '<hr><hr>'
    // }
  }

, travail_type(rubrique, travail_type){
    return `[[Travail type ${travail_type} de rubrique ${rubrique}]]`
  }
}

module.exports = HomeTestCode
