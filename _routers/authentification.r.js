'use script'

const express = require('express')
const router  = express.Router()


router
.get('/', function(){})
.get('/login', function(req,res){
  res.render('gabarit', {place: 'login', route_after:req.query.ra||''})
})
.post('/login', function(req, res){
  User.existsAndIsValid(req, res, {mail:req.body._umail_, password:req.body._upassword_, route_after:req.body.route_after})
})
.get('/logout', function(req,res){
  if ( req.user ) {
    Dialog.annonce(`À bientôt, ${req.user.pseudo} !`)
    delete req.session.user_id
    delete req.session.session_id
    delete req.user
  }
  res.redirect('/')
})

module.exports = router
