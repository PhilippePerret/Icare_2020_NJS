// const FrontTests

export const Waits = {
  whois: "Waits"
, test(){console.log("Waits chargé")}
}

/*
  @method wait(duree, msg)
  @asynchrone
  @description Attend la durée spécifiée par +msecs+ en millisecondes
  @provided
    :duree {Number} Nombre de millisecondes d'attente
    :msg {String} Optionnellement, le message à afficher pendant l'attente (il sera supprimé ensuite)
  @usage  await wait(1000, "J'attends une seconde…")
*/
window.wait = function(msecs, msg){
    if (msg) Log.discret(msg)
    return new Promise((ok,ko)=>{
      setTimeout(()=>{
        if ( msg ) Log.removeLast()
        ok()
      },msecs)
    })
  }

/*
  @method waitForElementExists(selector)
  @asynchrone
  @description Attend que l'élément désigné par +selector+ soit trouvé dans la page avant de poursuivre
  @provided
    :selector {String} Le sélector de l'élément à attendre.
  @usage await waitForElementExists('#monElement')
 */
window.waitForElementExists = function(selector){
  return new Promise((ok,ko)=>{
    var waitingTime = 0
    var timer = setInterval(()=>{
      waitingTime += 200
      if ( waitingTime > 10000 ) {
        clearInterval(timer)
        throw new Error(`Impossible de trouver l'élément désigné par ${selector}`)
      } else if ( wnd.document.querySelector(selector) ) {
        clearInterval(timer)
        ok()
      }
    }, 200)
  })
}

/*
  @method waitForPageReady()
  @asynchrone
  @description Attend que la page du site soit prête avant de poursuivre
  @usage  await waitForPageReady()
*/
window.waitForPageReady = async function(){
  await wait(200)
  return new Promise((ok,ko)=>{
    const MAX_LOOPER = 100
    var looper = 1
    var loopTimer = setInterval(()=>{
      looper ++
      if (looper > MAX_LOOPER) {
        clearInterval(loopTimer)
        raise("J'ai attendu trop longtemps que la page soit prête.")
      }
      console.log("wnd.document.readyState = ", wnd.document.readyState)
      if ( wnd.document.readyState ) {
        clearInterval(loopTimer)
        ok()
      }
    }, 100)
  })
}
