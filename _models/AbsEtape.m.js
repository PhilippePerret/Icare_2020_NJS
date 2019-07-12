'use strict'
/**
  |
  |
  | Class AbsEtape
  |
  | Gestion des étapes absolues des modules absolus
  |
  | Note : les méthodes de contrôleur sont chargées en bas de ce module
**/
class AbsEtape {
  constructor(id){
    this.id = id
  }
  /**
    Chargement des données
  **/
  async getData(){
    this.data = await DB.get('icare_modules.absetapes', this.id)
  }

  /**
    |
    | Propriétés fixes (enregistrées)
    |
    |
  **/
  get absModuleId() {return this.data.module_id}
  get numero()      {return this.data.numero}
  get titre()       {return this.data.titre}
  get travail()     {return this.data.travail}
  get travaux()     {return this.data.travaux}
  get objectif()    {return this.data.objectif}
  get methode()     {return this.data.methode}
  get duree()       {return this.data.duree}
  get duree_max()   {return this.data.duree_max}
  get liens()       {return this.data.liens}
}

Object.assign(AbsEtape, Sys.reqController('AbsEtape'))

module.exports = AbsEtape
