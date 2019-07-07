'use strict'
/**
  Test de l'acceptation d'un candidature par l'administration
**/
export async function test(){

  // On doit créer des candidatures
  await Ajax.send({method:'createSignups', args:{nombre:4}})

  constraint("L'administrateur peut rejoindre son tableau de bord")
  goto_dashboard()
  await Dom.hasText('Identification',{in:'h1'})
  var form = new Form('#login_form')
  form.fillWith({
      _umail_:      Marion.mail
    , _upassword_:  Marion.password
  })
  // await wait(10000)
  await form.submit()
  await Dom.hasText("Tableau de bord",  {in:'h2'})

  constraint("Il trouve une candidature à valider")
  await Dom.hasText("Candidatures", {in:'legend'})

}
