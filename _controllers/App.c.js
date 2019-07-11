'use strict'
/**
  |
  | L'application en générale, quel que soit le site
  |
  |
**/

const App = {

}

Object.defineProperties(App,{

  folder:{ get(){return APP_PATH} }

  // App.online est true si on est en online, false otherwise
, online:{
    get(){return this._online}
  , set(v){this._online = v}
  }

  // App.offline est true si on est en local, false otherwise
, offline:{
    get(){return this._offline}
  , set(v){this._offline = v}
  }

, currentUrl:{get(){
    return this.online ? this.url : 'localhost:3000'
  }}
  
, url:{ get(){
    return this.config.url
  }}

  // File ./config.app.json
, config:{
    get(){
      if (undefined === this._config) {
        this._config = System.require('config/app') || {}
      }
      return this._config
    }
  }

, PhilData:{
    get(){
      console.log("offline = ", this.offline)
      if ( this.offline ) {
        let phil = Sys.require('private/secret/phil.json')
        console.log("phil = ", phil)
        return phil
      } else {
        throw Error("Impossible d'obtenir les données administrateur par ce biais.")
      }
    }
  }
})

module.exports = App
