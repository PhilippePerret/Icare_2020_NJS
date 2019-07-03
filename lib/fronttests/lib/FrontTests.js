// const FrontTests

export const FrontTests = {
  whois: "FrontTest"

, test(){console.log("FrontTests chargé.")}

, reset(){
    this.failure_count = 0
    this.success_count = 0
    this.pending_count = 0
    return this // chainage
  }
, init(){
    this.failFast = !! document.querySelector('#fail_fast').checked
    if ( this.failFast ) console.log("Je dois m'arrêter au premier échec")
    return this // chainage
  }

}
