'use strict'

let FrontTests
import('./main.js')
  .then((module)=>{
    FrontTests = module.FrontTests
    if ( FrontTests.whois ) console.log("FrontTest est prêt")
    /**
      |
      | On définit ici les méthodes globales de tests
      | importées par le module
      |
      |
    **/
    window.wait = FrontTests.wait.bind(FrontTests)
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

export const Required = {
  FrontTests: FrontTests
}
