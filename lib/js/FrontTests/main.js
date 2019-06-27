// const FrontTests

export const FrontTests = {
  whois: "FrontTest"
, wait(msecs, msg){
    if (msg) console.log(msg)
    return new Promise((ok,ko)=>{
      setTimeout(ok,msecs)
    })
  }
}
