'use strict'

export async function test(){
  // --- TODO CRÉER UN TICKET ---
  // Note : ça doit se faire par ajax, ou alors on fait des faux tickets
  // dans support/tickets
  const ticket_id = 'IDDETICKET0123456789'
      , ticket_code = `Dialog.annonce("Le ticket a été correctement interprété.")`
  let retour = await Ajax.send({meth:'createFile',args:{path:`tmp/tickets/${ticket_id}`,code:ticket_code}})
  await url(`/tck/${ticket_id}`)
  await waitForPageReady()
  Dom.hasText("Le ticket a été correctement interprété.")

}
