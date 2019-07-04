'use strict'

async function loadDom(){
  var mod

  // mod = await import('./Waits.js')
  // let Waits = mod.Waits

  mod = await import('./ExpectSubject.js')
  let ExpectSubject = mod.ExpectSubject


  class DomSubject extends ExpectSubject {
    test(){console.log("Subject Dom chargé")}

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
    var sujet, pass, conteneurs, conteneur, texteConteneur
      , ajout = ''
    if ( params && params.in ){
      // Il faut regarder dans un élément. Plusieurs cas peuvent se présenter
      // ici :
      sujet = `Un élément ${params.in}`
      //  1. Le conteneur n'existe pas  => erreur
      //  2. Plusieurs conteneur existe => il faut tous les checker
      //  3. Un seul conteneur existe   => c'est lui qu'on checke
      var allIns = wnd.document.querySelectorAll(params.in)
      if ( allIns ) {
        conteneurs = []
        allIns.forEach(cont => conteneurs.push(cont.innerText))
      } else {
        pass = false
        ajout += ' (INTROUVABLE)'
      }
    } else {
      // Pas de conteneur (:in) indiqué
      sujet = "La page"
      conteneurs = [this.text]
      ajout = ""
    }
    if ( pass === undefined ) {
      pass = false
      for ( conteneur of conteneurs ) {
        if ( conteneur.includes(str) ) {
          pass = true
          break
        }
      }
    }
    // console.log(`Avec « ${str} », pass = ${pass}, positive = ${this.positive}`)
    new Assertion(
        pass
      , this.positive
      , {
          pos_success: `${sujet} contient bien « ${str} »${ajout}`
        , neg_success: `${sujet} ne contient pas « ${str} »${ajout}`
        , pos_failure: `${sujet} devrait contenir « ${str} »${ajout}${inDivMasked(this.text)}`
        , neg_failure: `${sujet} ne devrait pas contenir « ${str} »${ajout}${inDivMasked(this.text)}`
        }
      ).evaluate(params)
    }

    get html(){return wnd.document.body.innerHTML}
    get text(){return wnd.document.body.innerText}


    /*
      @method Dom.waitFor(selecteur)
      @asynchrone
      @description Permet d'attendre de trouver un élément dans le DOM. Passé un délai, retourne null
      @provided
        :selecteur {String} Le sélecteur de l'élément
        :selector  {HTMLElement} L'élément HTML
      @usage await Dom.waitFor('#monDiv')
     */
    async waitFor(selector){
      if ( wnd.document.querySelector(selector) ) return;
      await waitForElementExists(selector)
    }
  }// /Dom


  /**
    Quand on utilise `Dom.` dans les textes, ça renvoie une instance
    DomSubject grâce à cette définition
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
