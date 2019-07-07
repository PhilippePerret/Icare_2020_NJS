'use strict'

export const Ajax = {
  test(){console.log("Ajax chargé avec succès.")}
, send(data){
    data.meth = data.meth || data.method
    var args = []
    for ( var k in data.args ){
      var str = encodeURI(data.args[k])
      args.push(`args[${k}]=${str}`)
    }
    args = args.join('&')
    // console.log("args=",args)
    return new Promise((ok,ko)=>{
      $.get(`/fttajax?meth=${data.meth}&${args}`, ok)
    })
  }
}
