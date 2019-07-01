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


  constraint('Un pseudo ne peut pas être composé d’espaces')
  form.fillWith({
      'pseudo': '      '
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.not.hasText("Votre candidature est valide")
  Dom.hasText("le pseudo est absolument requis")
  Dom.element('#div-row-pseudo').hasClass('fieldError')


  constraint('Un pseudo peut contenir des accents et des espaces')
  form.fillWith({
      'pseudo': 'Étienne Souçaut'
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.not.hasText("Votre candidature est valide")
  Dom.not.hasText("le pseudo est absolument requis")
  Dom.not.hasText("le pseudo n’est pas valide")
  Dom.element('#div-row-pseudo').not.hasClass('fieldError')


  // constraint('Un pseudo ne peut pas être trop court')
  // email = getAEmail()
  // form.fillWith({
  //     'pseudo': 'Ph'
  //   , 'mail': email
  //   , 'mail_confirmation': email
  // })
  // await form.submit()
  // Dom.hasText("Votre candidature n'est pas valide")
  // Dom.hasText("le pseudo doit faire plus de 3 signes, il en fait 2")
  // Dom.element('#div-row-pseudo').hasClass('fieldError')
  // Dom.element('#div-row-mail').not.hasClass('fieldError')
  //
  //
  // constraint('Un pseudo ne peut pas être trop long')
  // form.fillWith({
  //   'pseudo': 'PhilPhilPhilPhilPhilPhilPhilPhilPhilPhilPhilPhilPhilPhilPhil'
  // })
  // await form.submit()
  // Dom.hasText("Votre candidature n'est pas valide")
  // Dom.hasText("le pseudo doit faire moins de 31 signes, il en fait 60")
  // Dom.element('#div-row-pseudo').hasClass('fieldError')
  //
  //
  // constraint('Un pseudo ne peut pas contenir des caractères spéciaux')
  // form.fillWith({
  //   'pseudo': 'Phil!'
  // })
  // await form.submit()
  // Dom.hasText("Votre candidature n'est pas valide")
  // Dom.hasText("le pseudo n’est pas valide")
  //
  //
  // constraint('Un pseudo doit être unique dans la base')
  // form.fillWith({
  //   'pseudo': 'Phil'
  // })
  // await form.submit()
  // Dom.hasText("Votre candidature n'est pas valide")
  // Dom.hasText("ce pseudo ne peut pas être utilisé")
  //
  //
  //
  // constraint("Le mail doit être non vide")
  // form.fillWith({
  //     'pseudo': getAPseudo()
  //   , 'mail':''
  //   , 'mail_confirmation':''
  //   , 'password':''
  //   , 'password_confirmation':''
  // })
  // await form.submit()
  // Dom.hasText("Votre candidature n'est pas valide")
  // Dom.not.hasText("le pseudo est absolument requis")
  // Dom.element('#div-row-pseudo').not.hasClass('fieldError')
  // Dom.hasText("le mail est absolument requis")
  // Dom.element('#div-row-mail').hasClass('fieldError')
  //
  //
  // constraint("Le mail doit être valide")
  // form.fillWith({
  //     'pseudo': getAPseudo()
  //   , 'mail':'mauvais-mail-pour.voir'
  //   , 'mail_confirmation':''
  //   , 'password':''
  //   , 'password_confirmation':''
  // })
  // await form.submit()
  // Dom.hasText("Votre candidature n'est pas valide")
  // Dom.hasText("le mail n’est pas valide")
  // Dom.not.hasText("le pseudo est absolument requis")
  // Dom.element('#div-row-pseudo').not.hasClass('fieldError')
  //
  //
  // constraint("Le mail doit être unique")
  // form.fillWith({
  //     'pseudo': getAPseudo()
  //   , 'mail':'phil@atelier-icare.net'
  //   , 'mail_confirmation':'phil@atelier-icare.net'
  //   , 'password':''
  //   , 'password_confirmation':''
  // })
  // await form.submit()
  // Dom.hasText("Votre candidature n'est pas valide")
  // Dom.hasText("le mail existe déjà, vous ne pouvez pas l’utiliser")
  //
  //
  // constraint("La confirmation du mail doit concorder")
  // form.fillWith({
  //     'pseudo': getAPseudo()
  //   , 'mail':'bonmail@pour.voir'
  //   , 'mail_confirmation':'badmail@pour.voir'
  //   , 'password':''
  //   , 'password_confirmation':''
  // })
  // await form.submit()
  // Dom.hasText("Votre candidature n'est pas valide")
  // Dom.hasText("le mail n’est pas correctement confirmé")


  constraint("Le mot de passe doit être soumis")
  pseudo  = getAPseudo()
  email   = getAEmail()
  form.fillWith({
    'pseudo': pseudo
  , 'mail':email
  , 'mail_confirmation':email
  , 'password':''
  , 'password_confirmation':''
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.hasText("le mot de passe est absolument requis")

  constraint("Le mot de passe doit faire au moins 6 signes")
    pseudo  = getAPseudo()
    email   = getAEmail()
    form.fillWith({
      'pseudo': pseudo
    , 'mail':email
    , 'mail_confirmation':email
    , 'password':' &&&$$$'
    , 'password_confirmation': '&&&$$$'
    })
    await form.submit()
    Dom.hasText("Votre candidature n'est pas valide")
    Dom.not.hasText("le mail n’est pas valide")
    Dom.hasText("le mot de passe doit faire plus de 6 signes, il en fait 6")


    constraint("Le mot de passe doit faire moins de 30 signes")
    pseudo  = getAPseudo()
    email   = getAEmail()
    form.fillWith({
      'pseudo': pseudo
    , 'mail':email
    , 'mail_confirmation':email
    , 'password':'1234567890123456789012345678901234567890'
    , 'password_confirmation': '&&&$$'
    })
    await form.submit()
    Dom.hasText("Votre candidature n'est pas valide")
    Dom.not.hasText("le mail n’est pas valide")
    Dom.hasText("le mot de passe doit faire moins de 30 signes, il en fait 40")


    constraint("Le mot de passe doit être bien confirmé")
    pseudo  = getAPseudo()
    email   = getAEmail()
    form.fillWith({
      'pseudo': pseudo
    , 'mail':email
    , 'mail_confirmation':email
    , 'password':'12345678901234567890'
    , 'password_confirmation': '1234567890123456789'
    })
    await form.submit()
    Dom.hasText("Votre candidature n'est pas valide")
    Dom.not.hasText("le mail n’est pas valide")
    Dom.hasText("le mot de passe n’est pas correctement confirmé")


}
