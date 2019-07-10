'use strict'
/**
  Router pour la partie administration
**/
const express = require('express')
const router  = express.Router()

// Barrière pour ne laisser passer que les administrateurs
router.use(User.checkIsAdmin)

global.Admin = Sys.reqController('Admin')

router
.get('/overview', async function(req,res){
  await Admin.initOverview()
  res.render('admin', {section_name: 'Aperçu général', section:'overview'})
})
.get('/', function(req,res){res.redirect('/admin/overview')})
.get('/dashboard', (req,res) => {
  // QUESTION : quel est la différence avec l'aperçu général ?
  res.render('admin', {section_name:'Tableau de bord', section:'dashboard'})
})
.get('/icariens', async function(req,res){
  res.render('admin', {section_name: 'Icariens', section:'icariens'})
})
.get('/:action', async function(req, res){
  Dialog.action_required("Je dois accomplir l'action " + req.params.action)
  res.redirect('/admin')
})

module.exports = router
