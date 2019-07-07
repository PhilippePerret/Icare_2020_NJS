'use strict'

export async function test(){

  let pseudo, email, pwd, patro, themail

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

    pseudo  = getAPseudo()
    email   = getAEmail()
    pwd     = 'un mot de passe?'
    patro   = getAPatronyme()

    constraint("Un module doit avoir été choisi")
    await form.fillWith({
        pseudo:pseudo, patronyme:patro
      , mail:email, mail_confirmation:email
      , password:pwd, password_confirmation:pwd
    })
    await form.submit()
    Dom.hasText("Votre candidature n'est pas valide")
    Dom.hasText("le module d’apprentissage est absolument requis")

    // constraint("Il faut donner le document de présentation")
    // form.fillWith({
    //     pseudo: pseudo
    //   , patronyme: patro
    //   , mail: email
    //   , mail_confirmation: email
    //   , password: pwd
    //   , password_confirmation: pwd
    // })
    // await form.submit()
    // Dom.hasText("Votre candidature n'est pas valide")
    // Dom.not.hasText("le mot de passe n’est pas valide")
    // Dom.hasText("le document de présentation est absolument requis")


    constraint("Le document de présentation doit être du bon type")
    email = getAEmail()
    form.fillWith({
        pseudo: pseudo
      , patronyme: getAPatronyme()
      , mail: email
      , mail_confirmation: email
      , password: pwd
      , password_confirmation: pwd
    })
    await form.submit()
    Dom.hasText("Votre candidature n'est pas valide")
    Dom.not.hasText("le mot de passe n’est pas valide")
    Dom.hasText("le document de présentation est absolument requis")


    constraint("Le document de présentation ne doit pas être trop court")
    email = getAEmail()
    form.fillWith({
        pseudo: pseudo
      , patronyme: getAPatronyme()
      , mail: email
      , mail_confirmation: email
      , password: pwd
      , password_confirmation: pwd
      , presentation: 'too_short_document.md'
    })
    await form.submit()
    Dom.hasText("Votre candidature n'est pas valide")
    Dom.not.hasText("le mot de passe n’est pas valide")
    Dom.not.hasText("le document de présentation est absolument requis")
    Dom.hasText("le document de présentation est trop court")
    Dom.element('#div-row-presentation').hasClass('fieldError')


    constraint("Le document de présentation ne doit pas être trop long")
    email = getAEmail()
    form.fillWith({
        pseudo: pseudo
      , patronyme: getAPatronyme()
      , mail: email
      , mail_confirmation: email
      , password: pwd
      , password_confirmation: pwd
      , presentation: 'very_long_document.md'
    })
    await form.submit()
    Dom.hasText("Votre candidature n'est pas valide")
    Dom.not.hasText("le mot de passe n’est pas valide")
    Dom.hasText("le document de présentation est trop long")
    Dom.element('#div-row-presentation').hasClass('fieldError')


    constraint("Le patronyme doit être unique")
    pseudo = getAPseudo()
    email = getAEmail()
    pwd = 'le joli mot de passe'
    form.fillWith({
        pseudo: pseudo
      , patronyme: 'Philippe Perret'
      , mail: email
      , mail_confirmation: email
      , password: pwd
      , password_confirmation: pwd
      , presentation: 'long_document.md'
    })
    await form.submit()
    Dom.hasText("Votre candidature n'est pas valide")
    Dom.not.hasText("le mot de passe n’est pas valide")
    Dom.not.hasText("le document de présentation est absolument requis")
    Dom.hasText("ce patronyme est déjà porté")


    action("On crée les bonnes données, mais en deux temps")
    await goto_homepage()// impératif !
    await click_signup_button() // impératif !
    pseudo  = getAPseudo()
    email   = getAEmail()
    pwd     = 'un mot de passe'
    form.fillWith({
        pseudo: pseudo
      , patronyme: getAPatronyme()
      , mail: email
      , mail_confirmation: 'bad'
      , password: pwd
      , password_confirmation: pwd
      , presentation: 'long_document.docx'
      , motivation:   'long_document.odt'
    })
    await wait(500)
    await form.submit()
    await waitForPageReady()

    Dom.hasText("Votre candidature n'est pas valide")
    Dom.hasText("le mail n’est pas correctement confirmé")
    Dom.hasText("le module d’apprentissage est absolument requis")

    action("J'ajoute la confirmation du mail et un document avec les extraits.")
    var modid = 1 + Math.rand(15)
    form.fillWith({
        mail_confirmation: email
      , extraits: 'short_document.docx'
      , module: modid
    })
    // TODO C'EST COMMME S'IL N'ÉTAIT PAS SOUMIS, CI-DESSOUS
    await form.submit()
    await wait(800)
    await waitForPageReady()
    Dom.not.hasText("Votre candidature n'est pas valide")

    constraint("La page a pour titre « Bravo !»")
    Dom.hasText('Bravo !', {in:'h2'})


    // Enfin, on crée la bonne donnée d'un seul coup
    constraint("Une candidature avec les bonnes données est efficiente")
    var startTime = Number(new Date())
    await goto_homepage()
    await click_signup_button()
    await Dom.waitFor('#new_user_form')
    pseudo  = getAPseudo()
    patro   = getAPatronyme()
    email   = getAEmail()
    pwd     = 'un mot de passe'
    form.fillWith({
        pseudo: pseudo
      , patronyme: patro
      , mail: email
      , mail_confirmation: email
      , password: pwd
      , password_confirmation: pwd
      , presentation: 'long_document.docx'
      , motivation:   'long_document.odt'
      , extraits:     'long_document.pdf'
      , naissance:    2020 - Math.rand(70)
      , module:       Math.rand(15)
    })
    await form.submit()
    await waitForPageReady()
    await Dom.hasText('Bravo !', {in:'h2'})
    Dom.not.hasText("Votre candidature n'est pas valide")


    // On récupère les données enregistrées de la candidature
    // Ou alors on lit juste un champ hidden qui contient cette valeur :
    var candidature_id = wnd.document.querySelector('#candidature_id').value

    // Ticket
    // --------------------------------------------
    // Un ticket a été créé pour confirmer le mail
    // note : il faut le tester avant les mails, car
    // on en a besoin pour tester le mail de confirmation
    // de l'adresse email.
    await Ticket.getAll({after: startTime})
    var ticket = Ticket.exists({required:'controllers/user/signup', method:"confirmMail", user_mail:email,method:"confirmMail",candidate_id:candidature_id},{success: 'Le ticket de confirmation du mail existe', failure: 'Le ticket de confirmation du mail devrait exister.'})

    // Des mails ont été envoyés à l'administration et à l'utilisateur
    // ---------------------------------------------------------------
    await Mail.getMails({after: startTime})
    // Mail confirmation utilisateur
    Mail.sent({after: startTime, to:email, subject: 'Votre candidature a été reçue'},{success:`Le ${MAIL} de confirmation de candidature a été envoyé`})
    // Mail à l'administration
    Mail.sent({after: startTime, to:'phil@atelier-icare.net', subject: 'Nouvelle candidature'}, {success:`Le ${MAIL} d’annonce de candidature a été envoyé à l’administration`})
    // Mail pour confirmer email
    Mail.sent({after: startTime, to:email, subject: 'Confirmation de votre adresse mèl', text: `href="http://www.atelier-icare.net/tck/${ticket.id}"`}, {success:`Un ${MAIL} de demande de confirmation de mail conforme a été envoyé`})

    // Une annonce a été produite sur le site
    await wait(1000)
    await goto_homepage()
    await wait(1000)
    await goto_homepage()
    Dom.hasText(`${pseudo} dépose sa candidature.`, {in:'fieldset#news'})

}
