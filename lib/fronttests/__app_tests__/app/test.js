'use strict'

export async function test(){
  await wait(2000, "I'm waiting 2 seconds before loading home page…")
  url('/')
  Dom.hasText('Accueil')
  await wait(2000, "I'm waiting 2 seconds before finishing tests…")
  Log.success('OK')
}
