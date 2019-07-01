'use strict'

export async function test(){

  await goto_homepage()

  await click_signup_button()

  await waitForPageReady()

  // Définition du formulaire courant
  let form = new Form('#new_user_form')

  // action("Je remplis le formulaire avec un pseudo vide")
  // form.fillWith({
  //     'pseudo': ''
  // })
  // await form.submit()
  // Dom.hasText("Votre candidature n'est pas valide")
  // Dom.hasText("Le pseudo ne doit pas être vide.")

  action("Je remplis le formulaire avec un pseudo trop court")
  form.fillWith({
      'pseudo': 'Ph'
    , 'mail': getAEmail()
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.hasText("Le pseudo doit faire plus de 3 signes (il en fait 2)")
  Dom.element('#div-row-pseudo').hasClass('fieldError')
  Dom.element('#div-row-mail').not.hasClass('fieldError')

  // action("Je remplis le formulaire avec un pseudo trop long")
  // form.fillWith({
  //   'pseudo': 'PhilPhilPhilPhilPhilPhilPhilPhilPhilPhilPhilPhilPhilPhilPhil'
  // })
  // await form.submit()
  // Dom.hasText("Votre candidature n'est pas valide")
  // Dom.hasText("Le pseudo est trop long")
  //
  // action("Je remplis le formulaire avec un pseudo contenant des caractères interdits")
  // form.fillWith({
  //   'pseudo': 'Phil!'
  // })
  // await form.submit()
  // Dom.hasText("Votre candidature n'est pas valide")
  // Dom.hasText("Le pseudo est invalide")
  //
  // action("Je remplis le formulaire avec un pseudo existant déjà")
  // form.fillWith({
  //   'pseudo': 'Phil'
  // })
  // await form.submit()
  // Dom.hasText("Votre candidature n'est pas valide")
  // Dom.hasText("Le pseudo existe déjà")



  // action("Je remplis le formulaire sans mail")
  // form.fillWith({
  //     'pseudo': getAPseudo()
  //   , 'mail':''
  //   , 'mail_confirmation':''
  //   , 'password':''
  //   , 'password_confirmation':''
  // })
  // // await wait(5000, "5 secondes pour voir les données")
  // await form.submit()
  // Dom.hasText("Votre candidature n'est pas valide")
  // Dom.not.hasText("votre pseudo est absolument requis")
  // Dom.element('#div-row-pseudo').not.hasClass('fieldError')
  // Dom.hasText("votre mail est absolument requis")
  // Dom.element('#div-row-mail').hasClass('fieldError')


  // action("Je remplis le formulaire avec un mail invalide")
  // form.fillWith({
  //     'pseudo': getAPseudo()
  //   , 'mail':'mauvais-mail-pour.voir'
  //   , 'mail_confirmation':''
  //   , 'password':''
  //   , 'password_confirmation':''
  // })
  // await form.submit()
  // Dom.hasText("Votre candidature n'est pas valide")
  // Dom.hasText("Le mail est invalide.")


  // action("Je remplis le formulaire avec une mauvaise confirmation de mail")
  // form.fillWith({
  //     'pseudo': getAPseudo()
  //   , 'mail':'bonmail@pour.voir'
  //   , 'mail_confirmation':'badmail@pour.voir'
  //   , 'password':''
  //   , 'password_confirmation':''
  // })
  // await form.submit()
  // Dom.hasText("Votre candidature n'est pas valide")
  // Dom.hasText("Le mail ne correspond pas à sa confirmation.")


  // action("Je remplis le formulaire avec un mail existant")
  // form.fillWith({
  //     'pseudo': getAPseudo()
  //   , 'mail':'phil@atelier-icare.net'
  //   , 'mail_confirmation':'phil@atelier-icare.net'
  //   , 'password':''
  //   , 'password_confirmation':''
  // })
  // await form.submit()
  // Dom.hasText("Votre candidature n'est pas valide")
  // Dom.hasText("Le mail existe déjà, vous ne pouvez pas l’utiliser.")

  //
  // Dom.hasText("Votre candidature a été prise en compte.")
  // Dom.hasText("Votre candidature n'est pas valide.")


  // const motdepasse = "mon mot de passe"
  //     , monmail = 'besoin@chez.lui'
  // form.fillWith({
  //     'pseudo': `Pilou${Number(new Date())}`
  //   , 'mail':monmail
  //   , 'mail_confirmation':monmail
  //   , 'password': motdepasse
  //   , 'password_confirmation': motdepasse
  //   , 'upresentation': 'long_document.md'
  //   , 'umotivation': 'long_document.txt'
  // })

}
// TheTest();
