'use strict'

/**
  |
  | En attendant de les mettre ailleurs, quelques méthodes utiles
**/
window.raise = function(message){
  throw new Error(message)
}

import('./FrontTests.js')
  .then((mod)=>{
    console.log("mod = ", mod)
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
    /**
      |
      | On définit ici les méthodes globales de tests
      | importées par le module
      |
      |
    **/
    window.wait = Waits.wait.bind(Waits)
    window.waitForPageReady = Waits.waitForPageReady.bind(Waits)
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
  | Pour le test du DOM
  |
**/
import('./Dom.js').then(mod=>{
  window.Dom = mod.Dom
  Dom.test() // un petit test
})

// export const Required = {
//   FrontTests: FrontTests
// }
