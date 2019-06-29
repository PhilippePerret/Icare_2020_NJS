'use strict'

export async function test(){
  await url("/")
  await wait(1000, "Je m'arrête sur la page d'accueil")
  // click('#header #btn-signup')
  await url("/signup", 'input[name="upseudo"]')
  var form = new Form('#new_user_form')


  // action("Je remplis le formulaire avec un pseudo vide")
  // form.fillWith({
  //     'upseudo': ''
  // })
  // form.submit()
  // await wait(500, "Je soumets le formulaire…")
  // Dom.hasText("Votre candidature n'est pas valide")
  // Dom.hasText("Le pseudo ne doit pas être vide.")


  action("Je remplis le formulaire sans mail")
  await wait(2000) // pour empêcher le remplissage automatique
  form.fillWith({
      'upseudo': getAPseudo()
    , 'umail':''
    , 'umail_confirmation':''
    , 'upassword':''
    , 'upassword_confirmation':''
  })
  form.submit()
  await wait(500, "Je soumets le formulaire")
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.hasText("Le mail ne doit pas être vide.")


  //
  // Dom.hasText("Votre candidature a été prise en compte.")
  // Dom.hasText("Votre candidature n'est pas valide.")



  const motdepasse = "mon mot de passe"
      , monmail = 'besoin@chez.lui'
  form.fillWith({
      'upseudo': `Pilou${Number(new Date())}`
    , 'umail':monmail
    , 'umail_confirmation':monmail
    , 'upassword': motdepasse
    , 'upassword_confirmation': motdepasse
    , 'upresentation': 'long_document.md'
    , 'umotivation': 'long_document.txt'
  })

}
// TheTest();
