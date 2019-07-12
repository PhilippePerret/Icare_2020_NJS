'use strict'
/**
  Router pour le bureau
**/
let express = require('express')
  , router  = express.Router()

// On doit s'assurer que l'user est bien un icarien ou un administrateur
// router.use(function(req,res,next){
//   UserCtrl.checkAutorisation(req,res) && next()
// })
router.use(User.checkAutorisation)

const Bureau  = Sys.reqController('Bureau')
const Frigo   = Sys.reqController('Frigo')

// Le préfix à ajouter à toutes les routes est : '/bureau'
router
// Sections principales
.get('/',             Bureau.homeSection)
.get('/preferences',  Bureau.preferencesSection)
.get('/historique',   Bureau.historiqueSection)
.get('/documents',    Bureau.documentsSection)
.get('/profil',       Bureau.profilSection)
.get('/travail',      Bureau.workSection)

// .post('/send_work', Bureau.sendWork)
// .get('/frigo',      Bureau.frigoSection)
// .post('/frigo',     Frigo.sendMessage)
// .delete('/frigo',   Frigo.deleteMessage)

module.exports = router
