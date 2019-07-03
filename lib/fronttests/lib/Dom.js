'use strict'

async function loadDom(){

  var mod = await import('./ExpectSubject.js')
  let ExpectSubject = mod.ExpectSubject

  class DomSubject extends ExpectSubject {
    test(){console.log("Dom chargé")}

    element(selector){
      return new DomElement(selector)
    }
  /*
    @method Dom.hasText(str[, params])
    @description Assertion qui produit un succès si la page courante contient le texte str, avec les paramètres fournis.
    @provided
      :str {String} Le texte cherché, qui peut être une expression régulière.
      :params {Object} Les paramètres éventuels, comme la description du contenant.
    @usage Dom.hasText("Mon message", { in:'div.message'} )
   */
  hasText(str, params){
    var texteContainer
    if ( params && params.in ){
      // Il faut regarder dans le code HTML
      texteContainer = wnd.document.querySelector(params.in).innerText
    } else {
      texteContainer = this.text
    }
    new Assertion(
        texteContainer.includes(str)
      , this.positive
      , {
          pos_success: `La page contient bien « ${str} »`
        , neg_success: `La page ne contient pas « ${str} »`
        , pos_failure: `La page devrait contenir « ${str} »`
        , neg_failure: `La page ne devrait pas contenir « ${str} »`
        }
      ).evaluate(params)
    }

    get html(){return wnd.document.body.innerHTML}
    get text(){return wnd.document.body.innerText}

  }// /Dom

  /**
    Quand on utilise `Dom.` dans les textes, ça renvoie une instance
    DomSubject
  **/
  Object.defineProperty(window, 'Dom', {
    get(){return new DomSubject()}
  })

  /**
    Un HTML Element à tester
  **/
  class DomElement extends ExpectSubject {
    constructor(selector){
      super()
      this.selector = selector
      this.domObj   = wnd.document.querySelector(selector) // peut exister ou non
      // console.log(`this.domObj de "${selector}" = `, this.domObj)
      this.sujet    = `L'élément ${selector}`
    }

    /*
      @method Dom.element(selector).hasClass(class, options)
      @description Produit un succès si l'élément correspondant au sélector +selector+ possède la class +class+
      @provided
        :class {String} La class CSS à trouver
        :class {Array} Les classes CSS à trouver
        :options {Object} Les [options classiques des assertions](#options_assertions)
      @usage Dom.element('#monDiv.saclasse').hasClass('saclasse') // => produit un succès
     */
    hasClass(classNames, options) {
      if ( Array.isArray(classNames) === false ) classNames = [classNames]
      var pass  = true
        , lacks = []
      for ( var className of classNames ){
        if ( this.domObj.classList.contains(className) === false ){
          pass = false
          lacks.push(className)
        }
      }

      // console.log({
      //   selector: this.selector,
      //   pass: pass,
      //   positive: this.positive,
      //   classes: this.domObj.classList
      // })

      var objet
      if ( classNames.length === 1 ){
        objet = `la class '${classNames[0]}'`
      } else {
        objet = `les classes [${classNames.join(', ')}]`
      }
      new Assertion(
          pass
        , this.positive
        , {
            pos_success: `${this.sujet} contient bien ${objet}`
          , neg_success: `${this.sujet} ne contient pas ${objet}`
          , pos_failure: `${this.sujet} devrait contenir ${objet} (manque ${lacks.join(', ')})`
          , neg_failure: `${this.sujet} ne devrait pas contenir ${objet}`
          }
        ).evaluate(options)
    }

  }// /DomElement


}




loadDom()
