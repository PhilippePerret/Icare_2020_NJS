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
, url:{ get(){return this.config.url} }

  // File ./config.app.json
, config:{
    get(){
      if (undefined === this._config) {
        this._config = System.require('config/app') || {}
      }
      return this._config
    }
  }
})

module.exports = App
