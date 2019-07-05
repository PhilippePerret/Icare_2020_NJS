'use strict'

export async function test(){

  // --- CRÉER UN TICKET ---
  // Note : ça doit se faire par ajax, ou alors on fait des faux tickets
  // dans support/tickets

  constraint("On peut jouer un ticket avec son URL")
  var ticket_id = 'IDDETICKET0123456789'
    , ticket_code = `Dialog.annonce("Le ticket a été correctement interprété.")`
    , ticket_path = `tmp/tickets/${ticket_id}`
  let retour = await Ajax.send({meth:'createFile',args:{path:ticket_path,code:ticket_code}})
  await url(`/tck/${ticket_id}`)
  await waitForPageReady()
  Dom.hasText("Le ticket a été correctement interprété.")
  await File.not.exists(ticket_path)

  constraint("On peut créer un ticket et obtenir son adresse")
  // Note : je fabrique d'abord le ticket qui va créer le ticket…

  // Préparation du test
  ticket_id = 'UNAUTRETICKETPOURCREERELETICKET'
  ticket_code = `const Ticket=require('./Ticket');Dialog.annonce("Le nouveau ticket a le numéro : ".concat(Ticket.create('Dialog.annonce("Recréation.")')))`
  ticket_path = `tmp/tickets/${ticket_id}`
  await Ajax.send({meth:'createFile', args:{path:ticket_path,code:ticket_code}})
  await File.exists(ticket_path)

  // Le test proprement dit : on joue le ticket, qui doit créer un ticket
  // (fichier) et retourner l'ID unique du ticket
  action("On joue le ticket")
  retour = await url(`/tck/${ticket_id}`)
  console.log("retour = ", retour)
  await File.not.exists(ticket_path)

  constraint("Un ticket est détruit après avoir été correctement exécuté.")

}
