'use strict'

/**
  |
  | En attendant de les mettre ailleurs, quelques méthodes utiles
**/
window.raise = function(message){
  throw new Error(message)
}

import('./node_modules/ph-math/index.js')
import('./node_modules/ph-array/index.js')

import('./FrontTests.js')
  .then((mod)=>{
    window.FrontTests = mod.FrontTests
    window.FrontTests.test()
    /**
      |
      | On définit ici les méthodes globales de tests
      | importées par le module
      |
      |
    **/
  })

let Waits
import('./Waits.js')
  .then((module)=>{
    Waits = module.Waits
    Waits.test()
  })

/**
  |
  | La propriété principale `[window.]wnd` qui permet de dialoguer
  | avec l'iframe du site à tester
  |
**/
import('./wnd.js').then((module)=>{
  console.log("`wnd` (iframe du site) est prêt (avec toutes ses méthodes, url, etc.)")
})

/**
  |
  | Pour les requêtes ajax
  |
  |
**/
import('./Ajax.js').then(mod => {
  window.Ajax = mod.Ajax
  Ajax.test()
})

/**
  |
  | Pour l'écriture des messages
  |
  |
**/
import('./Log.js').then(mod => {
  window.Log = mod.Log
  Log.test() // un petit test
})

/**
  |
  | Chargement des usines à données
  |
**/
import('./factories.js').then(mod => {
  console.log("Factories chargées")
})

/**
  |
  | Pour le remplissage et le test des formulaires
  |
  |
**/
import('./Form.js').then(mod => {
  window.Form = mod.Form
  Form.test() // un petit test
})

/**
  |
  | Pour le test des mails
  |
  |
**/
import('./Mail.js').then(mod => {
  Mail.test() // un petit test
})

/**
  |
  | Pour le test du DOM
  |
**/
import('./Dom.js')

/**
  |
  | Pour les assertions
  |
**/
import('./Assertion.js')

/**
  |
  | On requiert la liste des supports de test
  |
  |
**/
import('./supports.js').then((mod)=>{
  console.log("Modules des supports de test chargée.")
})
/**
  |
  | Enfin, on requiert la liste complète des tests (pas ceux à jouer, mais
  | tous les tests). Mais on n'en a plus besoin maintenant qu'on peut les
  | récupérer par ajax.
  |
  |
**/
import('./alltests.js').then( mod => {
  FrontTests.testsList = mod.testsList
  if ( 'object' === typeof FrontTests.testsList ){
    console.log("Liste des tests chargée correctement")
  }
})
/**
  |
  |
  | Chargement de la configuration des tests propres à l'application
  | courante (le fichier config/fronttests.js — noter que ce fichier
  | sert aussi en back-end)
  |
  |
**/
import('../___config.js').then(mod => {
  FrontTests.config = mod.FrontTestsConfig
  console.log("Configuration chargée : ", FrontTests.config)
})
