'use strict'
/**
  |
  |
  | Class IcModule
  |
  | Gestion des modules Icariens
  |
  | Note : le contrôleur est chargé en bas de ce module.
  |
**/
const AbsModule = Sys.reqModel('AbsModule')

class IcModule {
  constructor(mid){
    this.id = mid
  }
  async getData(){
    this.data = await DB.get('icare_modules.icmodules', this.id)
    console.log("data module : ", this.data)
    this._absmodule = new AbsModule(this.absModuleId)
    await this._absmodule.getData()
    console.log("data module absolu : ", this._absmodule.data)
  }

  /**
    |
    | Propriétés fixes (enregistrées)
    |
    |
  **/
  get absModuleId()   {return this.data.abs_module_id}
  get projectName()   {return this.data.project_name}
  get nextPaiement()  {return this.data.next_paiement}
  get paiements()     {return this.data.paiements}
  get startedAt()     {return this.data.started_at}
  get endedAt()       {return this.data.ended_at}
  get options()       {return this.data.options}
  get pauses()        {return this.data.pauses}
  get icetapes()      {return this.data.icetapes}

  get currentEtapeId(){return this.data.icetape_id}
  get absModule(){ return this._absmodule }


}

Object.assign(IcModule, Sys.reqController('IcModule'))

module.exports = IcModule
