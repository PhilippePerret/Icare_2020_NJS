'use strict'
const express = require('express')
const router  = express.Router()

router.use(User.checkIsAdmin)
global.Admin = Sys.reqController('Admin')

/**
  Tous les chargements qu'on doit faire pour cette partie
**/
const AbsModule = Sys.reqModel('AbsModule')
async function getAllModules(){
  var r = await AbsModule.getAllModules()
  return AbsModule.allModules
}

let MODULE_ID
router.use(function(req,res,next){
  MODULE_ID = req.body.module_id || req.query.module_id || req.query.mid
  if ( MODULE_ID ) MODULE_ID = parseInt(MODULE_ID,10)
  next()
})

router
.get('/', async function(req,res){
  /**
    Pour tout ce qui concerne les modules d'apprentissage, au niveau
    des données absolues, ou par exemple l'affichage d'un module d'icarien
    en particulier, pour voir comment il s'affiche.
  **/
  res.render('admin', {section_name: 'Modules', section:'modules', modules:modules})
})
.all('/absetapes', async function(req,res){
  let data_locals = {
      section_name:'Modules'
    , section:'modules'
    , sous_section:'absetapes'
  }
  /**
    Pour tout ce qui concerne les modules d'apprentissage, au niveau
    des données absolues, ou par exemple l'affichage d'un module d'icarien
    en particulier, pour voir comment il s'affiche.
  **/
  data_locals.modules = await getAllModules()
  /**
    Si un module est choisi, on le sait par la donnée req.body.module_id qui
    est renseignée. Dans ce cas, on charge toutes ses étapes
  **/
  data_locals.module_id = MODULE_ID // doit toujours être défini
  if ( MODULE_ID ) {
    // Si un module est choisi, on fait la liste de ces étapes, en version
    // instances AbsEtape.
    const AbsEtape = Sys.reqModel('AbsEtape')
    data_locals.current_module = await DB.get('icare_modules.absmodules', MODULE_ID)
    var all_data_etapes = await DB.getWhere('icare_modules.absetapes', {module_id:MODULE_ID}, '*', {order_by:'numero ASC'})
    data_locals.etapes = []
    for ( var data_etape of all_data_etapes ) {
      var ietape = new AbsEtape(data_etape.id)
      ietape.setData(data_etape)
      data_locals.etapes.push(ietape)
    }
  }
  res.render('admin', data_locals)
})

module.exports = router
