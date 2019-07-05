'use strict'


export async function test(){
  constraint("Une candidate avec les bonnes données peut s'inscrire à l'atelier")
  await goto_homepage()
  await click_signup_button()
  let form = new Form('#new_user_form')
  var pseudo = getAPseudo()
  var mail   = getAEmail()
  var pwd    = 'mot de passe'
  var patro  = getAPatronyme()
  await form.fillWith({
    pseudo: pseudo, patronyme:patro, mail:mail, mail_confirmation:mail,
    password:pwd, password_confirmation:pwd,
    module: 1+Math.rand(15), naissance:1964
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.hasText("le document de présentation est absolument requis", {in:'div.error'})
  Dom.hasText("le document « Lettre de motivation » est absolument requis", {in:'div.error'})

  action("La candidate donne le document présentation")
  await form.fillWith({
    presentation:'long_document.docx'
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.not.hasText("le document de présentation est absolument requis", {in:'div.error'})
  Dom.hasText("le document « Lettre de motivation » est absolument requis", {in:'div.error'})


  action("La candidate ajoute le document extraits")
  await form.fillWith({
    extraits:'short_document.md'
  })
  await form.submit()
  Dom.hasText("Votre candidature n'est pas valide")
  Dom.not.hasText("le document de présentation est absolument requis", {in:'div.error'})
  Dom.hasText("le document « Lettre de motivation » est absolument requis", {in:'div.error'})


  action("La candidate ajoute sa lettre de motivation")
  await form.fillWith({
    motivation: 'long_document.md'
  })
  await form.submit()
  Dom.not.hasText("Votre candidature n'est pas valide")
  Dom.not.hasText("le document de présentation est absolument requis", {in:'div.error'})
  Dom.not.hasText("le document « Lettre de motivation » est absolument requis", {in:'div.error'})
  Dom.hasText('Bravo !', {in:'h2'})
}
