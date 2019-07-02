'use strict'
/**
  Les fabriques usuelles
**/

class People {
static getAPatronyme(){
  return `${this.getAPrenom()} ${this.getANom()}`
}
static get pseudos(){
  if (undefined === this._pseudos){
    this._pseudos = ['Max','John','Phil','Marion','Ern','Ernest','Tom','Jim','Joe','Jul','Pitt','Helen','Mat','Carole','Sam','Sim','Cher','Will','Cath','Josh','Pearl','Pat','Véro','Sy']
  }
  return this._pseudos
}
static get pseudosCount(){
  if (undefined === this._pseudoscount) this._pseudoscount = this.pseudos.length
  return this._pseudoscount
}
static getANom(){
  return this.noms[Math.rand(this.nomsCount)]
}
static getAPrenom(){
  return this.prenoms[Math.rand(this.prenomsCount)]
}
static get noms(){
  if(undefined === this._noms){
    this._noms = ['Michel','Larousse','Littré','Royal','Martin','Mauriac','Debussy','Ravel','Mozart','Beethoven','Schumann','Chapel','Champolion','Charme','Chicre','Parnat','Barnot','Rondale','Dombasle','Senec','Verne','Vannier','Vondreuil','Verneuil','Trier','Iñiaritu','Hugo','Lamotte','Jezkova','Travis']
    this._noms = Array.shuffle(this._noms)
  }
  return this._noms
}
static get nomsCount(){
  if (undefined === this._nomscount) this._nomscount = this.noms.length
  return this._nomscount
}
static get prenoms(){
  if(undefined === this._prenoms){
    this._prenoms = ['Maxime', 'Élie', 'Salomé','Marion','Catherine','Philippe', 'Bernard', 'Clothilde','Jacques','Kevin','Frédéric','Nathalie','Géraldinie','Marjorie','Aurélie','Christophe','Stéphane','Stéphanie','Bérangère', 'Hugo','Martin']
    this._prenoms = Array.shuffle(this._prenoms)
  }
  return this._prenoms
}
static get prenomsCount(){
  if (undefined === this.prenomscount) this.prenomscount = this.prenoms.length
  return this.prenomscount
}

} // People

/*
  @method getAPseudo()
  @description retourne un pseudo aléatoire
  @usage let pseudo = getAPseudo()
 */
window.getAPseudo = function(){
  var n = `${Number(new Date())}`
    , len = n.length
  return `Pseudo${n.substring(len-10,len)}`
}

/*
@method getAEmail()
@description retourne un email aléatoire valide
@usage let email = getAEmail()
*/
window.getAEmail = function(){
  var n = `${Number(new Date())}`
    , len = n.length
    , n = n.substring(len - 7, len)
  return `user${n}@chez.moi`
}

window.getAPatronyme = function(){
  return People.getAPatronyme()
}
