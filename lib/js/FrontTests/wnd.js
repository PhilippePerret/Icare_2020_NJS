'use strict'
/**
  Module concernant `wdn`, la window du site qu'on est en train
  de tester.

  Pour le moment, il ne définit que `wnd` qui permet de faire des :
    wnd.location = '...'
    ou wnd.document.querySelector(...)
    etc.

**/

Object.defineProperties(window,{
  /**
    L'iFrame contenant le site à tester
    On utilise wnd.document.querySelector etc. pour travailler avec
  **/
  wnd:{get(){
    if ( undefined === this._wnd ) {
      let parent = window.parent
      this._wnd = parent.frames[0]
      console.log("wnd", wnd)
    }
    return this._wnd
  }}
})


Object.assign(window,{

  /*
    @method url(uri, waiter)
    @asynchrone
    @description Charge une URI dans la page. Ça peut être le path complet ou seulement /maressource
    @provited
      :uri {String} L'URI à atteindre
      :waiter {String} Optionnellement, le selecteur d'un élément à trouver dans la page pour déterminer qu'elle est chargée.
    @usage await url('/signup', 'button#btn_signup')
   */
  url(uri, waiter){
    waiter = waiter || '#footer'
    return new Promise((ok,ko)=>{
      wnd.location = uri
      var loadingTimer = setInterval(()=>{
        if ( wnd.document.querySelector(waiter) ){
          clearInterval(loadingTimer)
          loadingTimer = null
          ok()
        }
      },100)
    })
  }

})
