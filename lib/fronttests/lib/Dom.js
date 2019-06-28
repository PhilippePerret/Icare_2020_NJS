'use strict'

async function loadDom(){

  var mod = await import('./ExpectSubject.js')
  let ExpectSubject = mod.ExpectSubject

  window.Dom = class extends ExpectSubject {
  static test(){console.log("Dom chargé")}

  /*
    @method Dom.hasText(str[, params])
    @description Assertion qui produit un succès si la page courante contient le texte str, avec les paramètres fournis.
    @provided
      :str {String} Le texte cherché, qui peut être une expression régulière.
      :params {Object} Les paramètres éventuels, comme la description du contenant.
    @usage Dom.hasText("Mon message", { in:'div.message'} )
   */
  static hasText(str, params){
    var pass
    if ( params && params.in ){
      // Il faut regarder dans le code HTML
      pass = false
    } else {
      pass = this.positive == this.text.includes(str)
    }
    new Assertion(
        pass
      , this.positive
      , {
          pos_success: `La page contient bien « ${str} »`
        , neg_success: `La page ne contient pas « ${str} »`
        , pos_failure: `La page devrait contenir « ${str} »`
        , neg_failure: `La page ne devrait pas contenir « ${str} »`
        }
      ).evaluate(params)
    }

  static get html(){return wnd.document.body.innerHTML}
  static get text(){return wnd.document.body.innerText}
  }


  // let ExpectSubject
  // import('./ExpectSubject.js').then((mod) => {
  //   ExpectSubject = mod.ExpectSubject
  // })

}


// export class Dom extends ExpectSubject {
// static test(){console.log("Dom chargé")}
//
// /*
//   @method Dom.hasText(str[, params])
//   @description Assertion qui produit un succès si la page courante contient le texte str, avec les paramètres fournis.
//   @provided
//     :str {String} Le texte cherché, qui peut être une expression régulière.
//     :params {Object} Les paramètres éventuels, comme la description du contenant.
//   @usage Dom.hasText("Mon message", { in:'div.message'} )
//  */
// static hasText(str, params){
//   var pass
//   if ( params && params.in ){
//     // Il faut regarder dans le code HTML
//     pass = false
//   } else {
//     pass = this.positive == this.text.includes(str)
//   }
//   new Assertion(
//       pass
//     , this.positive
//     , {
//         pos_success: `La page contient bien « ${str} »`
//       , neg_success: `La page ne contient pas « ${str} »`
//       , pos_failure: `La page devrait contenir « ${str} »`
//       , neg_failure: `La page ne devrait pas contenir « ${str} »`
//       }
//     ).evaluate(params)
//   }
//
// static get html(){return wnd.document.body.innerHTML}
// static get text(){return wnd.document.body.innerText}
// }

loadDom()
