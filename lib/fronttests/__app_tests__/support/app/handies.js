'use strict'
/**
  Les méthodes pratiques

  [1] MÉTHODES POUR SE RENDRE SUR UNE PAGE
  [2] MÉTHODES POUR POUR INTERAGIR AVEC L'INTERFACE
**/

// ---------------------------------------------------------------------
//  [1] MÉTHODES POUR SE RENDRE SUR UNE PAGE

window.goto_homepage = async function(){
  action("Je rejoins la page d'accueil")
  await url("/")
  // await waitFor(() => {return DOM.exists('h1#site_name')})
  await waitForPageReady()
}

// ---------------------------------------------------------------------
// [2] MÉTHODES POUR POUR INTERAGIR AVEC L'INTERFACE

window.click_signup_button = async function(){
  action("Je clique sur le bouton signup")
  wnd.document.querySelector('#header #btn-signup') || (
    await waitForElementExists('#header #btn-signup')
  )
  wnd.document.querySelector('#header #btn-signup').click()
}
