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
  @method waitForElementExists(selector, options)
  @asynchrone
  @description Attend que l'élément désigné par +selector+ soit trouvé dans la page avant de poursuivre
  @provided
    :selector {String} Le sélector de l'élément à attendre.
    :options {Object} Options. {timeout: le temps max à attendre (10 secondes par défaut), frequence: fréquence de check (1/5 seconde par défaut)}
  @usage await waitForElementExists('#monElement')
 */
window.waitForElementExists = function(selector){
  options = options || {}
  options.timeout   || Object.assign(options,{timeout:10000})
  options.frequence || Object.assign(options,{frequence:200})
  return new Promise((ok,ko)=>{
    var waitingTime = 0
    var timer = setInterval(()=>{
      waitingTime += options.frequence
      if ( waitingTime > options.timeout ) {
        clearInterval(timer)
        throw new Error(`Impossible de trouver l'élément désigné par ${selector}`)
      } else if ( wnd.document.querySelector(selector) ) {
        clearInterval(timer)
        ok(true)
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
  Log.discret("J'attends que la page soit prête…")
  await wait(200)
  return new Promise((ok,ko)=>{
    const MAX_LOOPER = 100
    var looper = 1
    var loopTimer = setInterval(()=>{
      looper ++
      if (looper > MAX_LOOPER) {
        Log.removeLast()
        clearInterval(loopTimer)
        raise("J'ai attendu trop longtemps que la page soit prête.")
      }
      console.log("wnd.document.readyState = ", wnd.document.readyState)
      if ( wnd.document.readyState ) {
        clearInterval(loopTimer)
        Log.removeLast()
        ok()
      }
    }, 100)
  })
}
