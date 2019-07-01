'use strict'

export async function test(){

  let pseudo, email

  await goto_homepage()

  await click_signup_button()

  await waitForPageReady()

  // Définition du formulaire courant
  let form = new Form('#new_user_form')

  constraint('Un pseudo ne peut pas être vide')
  form.fillWith({
      'pseudo': ''
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.not.hasText("Votre candidature est valide")
  Dom.hasText("le pseudo est absolument requis")
  Dom.element('#div-row-pseudo').hasClass('fieldError')


  constraint('Un pseudo ne peut pas être trop court')
  email = getAEmail()
  form.fillWith({
      'pseudo': 'Ph'
    , 'mail': email
    , 'mail_confirmation': email
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.hasText("le pseudo doit faire plus de 3 signes, il en fait 2")
  Dom.element('#div-row-pseudo').hasClass('fieldError')
  Dom.element('#div-row-mail').not.hasClass('fieldError')


  constraint('Un pseudo ne peut pas être trop long')
  form.fillWith({
    'pseudo': 'PhilPhilPhilPhilPhilPhilPhilPhilPhilPhilPhilPhilPhilPhilPhil'
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.hasText("le pseudo doit faire moins de 31 signes, il en fait 60")
  Dom.element('#div-row-pseudo').hasClass('fieldError')


  constraint('Un pseudo ne peut pas contenir des caractères spéciaux')
  form.fillWith({
    'pseudo': 'Phil!'
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.hasText("le pseudo n’est pas valide")


  constraint('Un pseudo doit être unique dans la base')
  form.fillWith({
    'pseudo': 'Phil'
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.hasText("ce pseudo ne peut pas être utilisé")



  constraint("Le mail doit être non vide")
  form.fillWith({
      'pseudo': getAPseudo()
    , 'mail':''
    , 'mail_confirmation':''
    , 'password':''
    , 'password_confirmation':''
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.not.hasText("le pseudo est absolument requis")
  Dom.element('#div-row-pseudo').not.hasClass('fieldError')
  Dom.hasText("le mail est absolument requis")
  Dom.element('#div-row-mail').hasClass('fieldError')


  constraint("Le mail doit être valide")
  form.fillWith({
      'pseudo': getAPseudo()
    , 'mail':'mauvais-mail-pour.voir'
    , 'mail_confirmation':''
    , 'password':''
    , 'password_confirmation':''
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.hasText("le mail n’est pas valide")
  Dom.not.hasText("le pseudo est absolument requis")
  Dom.element('#div-row-pseudo').not.hasClass('fieldError')


  constraint("Le mail doit être unique")
  form.fillWith({
      'pseudo': getAPseudo()
    , 'mail':'phil@atelier-icare.net'
    , 'mail_confirmation':'phil@atelier-icare.net'
    , 'password':''
    , 'password_confirmation':''
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.hasText("le mail existe déjà, vous ne pouvez pas l’utiliser")


  constraint("La confirmation du mail doit concorder")
  form.fillWith({
      'pseudo': getAPseudo()
    , 'mail':'bonmail@pour.voir'
    , 'mail_confirmation':'badmail@pour.voir'
    , 'password':''
    , 'password_confirmation':''
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.hasText("le mail n’est pas correctement confirmé")



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
