'use strict'
/**
  |
  | Class Watcher
  |
  | Gestion des watchers
  |
**/

class Watcher {
  
  constructor(data){
    this.data = data
  }

  get user_id()   {return this.data.user_id   }
  get processus() {return this.data.processus }
  get objet()     {return this.data.objet }
  get objet_id()  {return this.data.objet_id }
  get triggered() {return this.data.triggered }
  get dataW()     {return this.data.data }

}

module.exports = Watcher
