// const FrontTests

export const FrontTests = {
  whois: "FrontTest"

, test(){console.log("FrontTests chargé.")}

, reset(){
    this.failure_count = 0
    this.success_count = 0
    this.pending_count = 0
    // Quand on demande à jouer tous les tests (de la wishList)
    delete this.current_test_index
    delete this.runningTestsList
    
    return this // chainage
  }
, init(){
    this.failFast = this.config.fail_fast || false
    document.querySelector('#fail_fast').checked = this.failFast
    if ( this.failFast ) console.log("Je dois m'arrêter au premier échec")
    return this // chainage
  }

}
