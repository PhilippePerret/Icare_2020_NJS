'use strict'

export async function test(){
  // await url("/")

  action("Je rejoins la page d'accueil")
  await goto_homepage()

  action("Je clique sur le bouton signup")
  await click_signup_button()

  await waitForPageReady()

  // Définition du formulaire courant
  let form = new Form('#new_user_form')

  action("Je remplis le formulaire avec un pseudo vide")
  form.fillWith({
      'upseudo': ''
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.hasText("Le pseudo ne doit pas être vide.")

  action("Je remplis le formulaire avec un pseudo trop court")
  form.fillWith({
    'upseudo': 'Ph'
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.hasText("Le pseudo est trop court")

  action("Je remplis le formulaire avec un pseudo trop long")
  form.fillWith({
    'upseudo': 'PhilPhilPhilPhilPhilPhilPhilPhilPhilPhilPhilPhilPhilPhilPhil'
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.hasText("Le pseudo est trop long")

  action("Je remplis le formulaire avec un pseudo contenant des caractères interdits")
  form.fillWith({
    'upseudo': 'Phil!'
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.hasText("Le pseudo est invalide")

  action("Je remplis le formulaire avec un pseudo existant déjà")
  form.fillWith({
    'upseudo': 'Phil'
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.hasText("Le pseudo existe déjà")



  action("Je remplis le formulaire sans mail")
  form.fillWith({
      'upseudo': getAPseudo()
    , 'umail':''
    , 'umail_confirmation':''
    , 'upassword':''
    , 'upassword_confirmation':''
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.hasText("Le mail ne doit pas être vide.")


  action("Je remplis le formulaire avec un mail invalide")
  form.fillWith({
      'upseudo': getAPseudo()
    , 'umail':'mauvais-mail-pour.voir'
    , 'umail_confirmation':''
    , 'upassword':''
    , 'upassword_confirmation':''
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.hasText("Le mail est invalide.")

  
  // action("Je remplis le formulaire avec une mauvaise confirmation de mail")
  // form.fillWith({
  //     'upseudo': getAPseudo()
  //   , 'umail':'bonmail@pour.voir'
  //   , 'umail_confirmation':'badmail@pour.voir'
  //   , 'upassword':''
  //   , 'upassword_confirmation':''
  // })
  // await form.submit()
  // Dom.hasText("Votre candidature n'est pas valide")
  // Dom.hasText("Le mail ne correspond pas à sa confirmation.")


  action("Je remplis le formulaire avec un mail existant")
  form.fillWith({
      'upseudo': getAPseudo()
    , 'umail':'phil@atelier-icare.net'
    , 'umail_confirmation':'phil@atelier-icare.net'
    , 'upassword':''
    , 'upassword_confirmation':''
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.hasText("Le mail existe déjà, vous ne pouvez pas l’utiliser.")

  //
  // Dom.hasText("Votre candidature a été prise en compte.")
  // Dom.hasText("Votre candidature n'est pas valide.")


  // const motdepasse = "mon mot de passe"
  //     , monmail = 'besoin@chez.lui'
  // form.fillWith({
  //     'upseudo': `Pilou${Number(new Date())}`
  //   , 'umail':monmail
  //   , 'umail_confirmation':monmail
  //   , 'upassword': motdepasse
  //   , 'upassword_confirmation': motdepasse
  //   , 'upresentation': 'long_document.md'
  //   , 'umotivation': 'long_document.txt'
  // })

}
// TheTest();
