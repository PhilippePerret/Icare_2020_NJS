'use strict'
/**
  Module pour les modules absolus
**/
const path = require('path')
const fs = require('fs')

class AbsModule {
  // ---------------------------------------------------------------------
  //  CLASSE

  static get allModules(){
    return this._allmodules
  }
  static async getAllModules(){
    this._allmodules = await DB.getAll('icare_modules.absmodules')
    this._allmodules = this._allmodules.map( dmod => new AbsModule(dmod))
  }

  // ---------------------------------------------------------------------
  //  INSTANCE
  constructor(data){
    this.data = data
  }

  // ---------------------------------------------------------------------
  //  Propriétés fixes du module absolu

  get id(){ return this.data.id }
  get module_id(){ return this.data.module_id }
  get name(){ return this.data.name }
  get tarif(){ return this.data.tarif }
  get nombre_jours(){ return this.data.nombre_jours }
  get hduree(){ return this.data.hduree }
  get short_description(){ return this.data.short_description }
  get long_description(){ return this.data.long_description }

  // ---------------------------------------------------------------------
  // Propriétés volatiles

  // ---------------------------------------------------------------------
  // Méthodes d'helper

}


module.exports = AbsModule
