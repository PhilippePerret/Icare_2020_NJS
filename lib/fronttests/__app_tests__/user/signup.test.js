'use strict'

export async function test(){
  await url("/")
  await wait(1000, "Je m'arrête sur la page d'accueil")
  // click('#header #btn-signup')
  await url("/signup", 'input[name="_upseudo_"]')
  var form = new Form('#new-user-form')
  await wait(2000, "Je remplis le formulaire")
  form.fillWith({
      '_upseudo_': 'Phil'
    , '_umail_':   'phil@atelier-icare.net'
    , '_upassword_': 'mon mot de passe'
    , '_upassword_confirmation_': 'autre mot de passe'
  })
  await wait(2000, "Je vais soumettre le formulaire")
  form.submit()
  Dom.hasText("Votre candidature a été prise en compte.")
  Dom.hasText("Votre candidature n'est pas valide.")
}
// TheTest();
