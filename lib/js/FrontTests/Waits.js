// const FrontTests

export const Waits = {
  whois: "Waits"
, test(){console.log("Waits chargé")}
/*
  @method wait(duree, msg)
  @asynchrone
  @description Attend la durée spécifiée par +msecs+ en millisecondes
  @provided
    :duree {Number} Nombre de millisecondes d'attente
    :msg {String} Optionnellement, le message à afficher pendant l'attente (il sera supprimé ensuite)
  @usage  await wait(1000, "J'attends une seconde…")
*/
, wait(msecs, msg){
    if (msg) Log.discret(msg)
    return new Promise((ok,ko)=>{
      setTimeout(()=>{
        if ( msg ) Log.removeLast()
        ok()
      },msecs)
    })
  }

/*
  @method waitForPageReady()
  @asynchrone
  @description Attend que la page du site soit prête avant de poursuivre
  @usage  await waitForPageReady()
*/
, async waitForPageReady(){
    await wait(200)
    return new Promise((ok,ko)=>{
      const MAX_LOOPER = 1000
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

}
