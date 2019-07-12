'use strict'
/**
  |
  |
  | Class IcEtape
  |
  | Gestion des étapes de modules Icariens
  |
  | Note : le contrôleur est chargé en bas de ce module.
  |
**/
const AbsEtape = Sys.reqModel('AbsEtape')

class IcEtape {
  constructor(eid){
    this.id = eid
  }
  async getData(){
    this.data = await DB.get('icare_modules.icetapes', this.id)
    console.log("data étape : ", this.data)
    this._absetape = new AbsEtape(this.absEtapeId)
    await this._absetape.getData()
    console.log("data étape absolue : ", this._absetape.data)
  }

  /**
    |
    | Propriétés fixes (enregistrée)
    |
    |
  **/
  get numero()        {return this.data.numero}
  get startedAt()     {return this.data.started_at}
  get endedAt()       {return this.data.ended_at}
  get status()        {return this.data.status}
  get documents()     {return this.data.documents}
  get options()       {return this.data.options}
  get travailPropre() {return this.data.travail_propre}
  get expectedEnd()   {return this.data.expected_end}
  get icmoduleId()    {return this.data.icmodule_id}
  get absEtapeId()    {return this.data.abs_etape_id}

  /**
    |
    | Propriétés volatiles
    |
    |
  **/
  /**
    @return {AbsEtape} Instance de l'étape absolue
  **/
  get absEtape(){ return this._absetape }

  /**
    |
    | Méthodes d'helper
    |
    |
  **/

}

Object.assign(IcEtape, Sys.reqController('IcEtape'))

module.exports = IcEtape
