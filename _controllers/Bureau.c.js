'use strict'
/**
  Contrôleur du Bureau
**/
const Bureau = {
  /**
    L'accueil et la section du travail
  **/
  async homeSection(req,res){
    const Travail   = Sys.reqModel('Travail')
    const IcModule  = Sys.reqModel('IcModule')
    const IcEtape   = Sys.reqModel('IcEtape')
    let icmodule = new IcModule(req.user.icmodule_id)
    await icmodule.getData()
    let icetape  = new IcEtape(icmodule.currentEtapeId)
    await icetape.getData()
    let travail = new Travail(icmodule, icetape)
    res.render('bureau', {section:'home', travail: travail})
  }
, preferencesSection(req,res){
    res.render('bureau', {section:'preferences'})
  }
, historiqueSection(req,res){
    res.render('bureau', {section:'historique'})
  }
, documentsSection(req,res){
    res.render('bureau', {section:'documents'})
  }
, profilSection(req,res){
    res.render('bureau', {section:'profil'})
  }
, async workSection(req,res){
    const Travail   = Sys.reqModel('Travail')
    const IcModule  = Sys.reqModel('IcModule')
    const IcEtape   = Sys.reqModel('IcEtape')
    let icmodule = new IcModule(req.user.icmodule_id)
    await icmodule.getData()
    let icetape  = new IcEtape(icmodule.currentEtapeId)
    await icetape.getData()
    let travail = new Travail(icmodule, icetape)
    res.render('bureau', {section:'travail', travail: travail})
  }
}
module.exports = Bureau
