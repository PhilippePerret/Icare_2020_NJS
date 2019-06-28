// const FrontTests

export const FrontTests = {
  whois: "FrontTest"

, test(){console.log("FrontTests chargé.")}

, reset(){
    this.failure_count = 0
    this.success_count = 0
    this.pending_count = 0
  }

}
