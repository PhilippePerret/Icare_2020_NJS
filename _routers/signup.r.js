'use strict'
const express = require('express')
const router  = express.Router()
const multer  = require('multer') // Pour l'upload de fichier (multipart)
const upload  = multer({ dest: 'uploads/' })
const uuidv4  = require('uuid/v4');


const Signup = Sys.reqController('User/Signup')

router
.get('/', async function(req,res){
  var token = uuidv4()
  req.session.form_token = token
  res.render('gabarit', {place:'signup', token:token, action:'formulaire'})
})
.post('/', upload.any(), async function(req, res){
  FrontTests.checkFields(req)
  var signup = await Signup.isValid(req, res)
  if ( signup ) {
    res.render('gabarit', {place:'signup', action:'confirmation', candidature_id:signup.uuid })
  } else {
    var token = uuidv4()
    req.session.form_token = token
    Dialog.error(req.flash('error'))
    res.render('gabarit', {place:'signup', token: token, action:'formulaire'})
  }
})
.get('/documents', function(req,res){
  res.render('gabarit', {place:'signup', action:'documents'})
})
.get('/explication', function(req,res){
  res.render('gabarit', {place:'signup', action:'explication'})
})

module.exports = router
