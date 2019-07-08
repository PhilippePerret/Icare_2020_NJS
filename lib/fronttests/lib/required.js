'use strict'

/**
  |
  | En attendant de les mettre ailleurs, quelques méthodes utiles
**/
class Loader {
  static load(name, callback){
    if (undefined === this.loads){
      this.loads = new Map()
      this.loadings = 0 // le nombre de modules en cours de chargement
    }
    var loader = new Loader(name, callback)
    this.loads.set(name, loader)
    ++ this.loadings
    loader.start()
  }
  static endLoad(loader){
    -- this.loadings
    this.checkEnd()
  }

  // Méthode qui checke si c'est la fin des chargements
  static checkEnd(){
    if ( this.loadings === 0 ) {
      console.log("=== Tous les modules ont été chargés avec succès. ===")
      FrontTests.onReady()
    }
  }

  // ---------------------------------------------------------------------
  // Instance
  constructor(name, callback){
    this.name     = name
    this.callback = callback
    this.status   = 0
  }
  // Démarrage du chargement
  start(){
    this.addStatus(1)
    import(this.name).then(this.end.bind(this))
  }
  // Fin du chargement
  end(mod){
    this.addStatus(2)
    console.log(`${this.name} chargé avec succès.`)
    if ( mod && typeof mod.test === 'function') {
      mod.test()
    }
    this.callback && this.callback.call(this, mod)
    this.constructor.endLoad(this)
  }

  addStatus(valeur){ this.status += valeur }
}


window.raise = function(message){
  throw new Error(message)
}

Loader.load('./node_modules/ph-math/index.js')
Loader.load('./node_modules/ph-array/index.js')

Loader.load('./FrontTests.js', mod => {
    window.FrontTests = mod.FrontTests
    window.FrontTests.test()
})

let Waits
Loader.load('./Waits.js', mod => { Waits = mod.Waits })

/**
  |
  | La propriété principale `[window.]wnd` qui permet de dialoguer
  | avec l'iframe du site à tester
  |
**/
Loader.load('./wnd.js')
Loader.load('./Handies.js')

/**
  |
  | Pour les requêtes ajax
  |
  |
**/
Loader.load('./Ajax.js', mod => { window.Ajax = mod.Ajax })

/**
  |
  | Pour l'écriture des messages
  |
  |
**/
Loader.load('./Log.js', mod => {window.Log = mod.Log} )

/**
  |
  | Chargement des usines à données
  |
**/
Loader.load('./factories.js')

/**
  |
  | Pour le remplissage et le test des formulaires
  |
  |
**/
Loader.load('./Form.js', mod => {window.Form = mod.Form})

/**
  |
  | Pour le test des mails
  |
  |
**/
Loader.load('./Mail.js')

// Tous les modules qui ont besoin de ExpectSubject
Loader.load('./ExpectSubject.js', mod => {
  window.ExpectSubject = mod.ExpectSubject
  /**
    |
    | Pour le test des fichiers
    |
  **/
  Loader.load('./File.js')
  /**
    |
    | Pour le test des tickets
    |
    |
  **/
  Loader.load('./Ticket.js')
})

/**
  |
  | Pour le test du DOM
  |
**/
Loader.load('./Dom.js')

/**
  |
  | Pour les assertions
  |
**/
Loader.load('./Assertion.js')

/**
  |
  | On requiert la liste des supports de test
  |
  |
**/
Loader.load('./supports.js')

/**
  |
  | Enfin, on requiert la liste complète des tests (pas ceux à jouer, mais
  | tous les tests). Mais on n'en a plus besoin maintenant qu'on peut les
  | récupérer par ajax.
  |
  |
**/
Loader.load('./alltests.js')

/**
  |
  |
  | Chargement de la configuration des tests propres à l'application
  | courante (le fichier config/fronttests.js — noter que ce fichier
  | sert aussi en back-end)
  |
  |
**/
Loader.load('../___config.js', mod => {
  FrontTests.config = mod.FrontTestsConfig
  console.log("Configuration chargée : ", FrontTests.config)
})
