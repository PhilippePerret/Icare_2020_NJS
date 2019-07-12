'use strict'
/**
  Mon router paypal
**/
const path    = require('path');
const express = require('express')
const router  = express.Router()
const Paypal  = require('paypal-rest-sdk');

const DataPaypal = Sys.reqSecret('paypal.json')
const AbsModule  = Sys.reqModel('AbsModule')

const dataPaypal = App.offline ? DataPaypal.sandbox : DataPaypal.live
// console.log("dataPaypal = ", dataPaypal)

Paypal.configure({
    mode:           dataPaypal.mode
  , client_id:      dataPaypal.client_id
  , client_secret:  dataPaypal.client_secret
})

// Méthode appelée par la route '/paiement' lorsque l'on clique sur son
// bouton de paiement, souvent depuis son bureau
router.get('/', async function(req,res){
  if ( req.user ) {
    var hasPaiement       = await req.user.hasPaiement()
    var hasPaiementFutur  = await req.user.hasPaiementFutur()
    console.log("hasPaiement, hasPaiementFutur = ", hasPaiement, hasPaiementFutur)
    res.render('gabarit', {place: hasPaiement ? 'paiement' : 'paiement_none', futurPaiement:hasPaiementFutur})
  } else {
    Dialog.action_required("Vous devez être reconnu du site, pour exécuter ce paiement.")
    res.redirect('/auth/login')
  }
})
.post('/payer', async function(req,res){
  var paiement = new Paiement(res, 1, 12)
  paiement.exec()
})
.get('/success', function(req,res){
  Dialog.annonce("Bravo ! votre paiement a pu être effectué !")
  res.render('gabarit', {place: 'paiement'})
})
.get('/failure', function(req, res){
  Dialog.error("Un problème est malheureusement survenu au cours de votre paiement…")
  res.render('gabarit', {place: 'paiement'})
})

class Paiement {
  constructor(response, user_id, module_id){
    this.user_id    = user_id
    this.module_id  = module_id
    this.response   = response
  }

  /**
    Pour créer le paiement
  **/
  exec(){
    this.execTransaction()
    .then(this.receive.bind(this))
    .catch(this.onError.bind(this))
  }
  // Retour de la demande de paiement
  receive(transaction){
    console.log("transaction reçue : ", transaction)
    var id = transaction.id;
    var links = transaction.links;
    var counter = links.length;
    while ( counter -- ) {
      console.log(`links[${counter}] = `, links[counter])
      if ( links[counter].method == 'REDIRECT') {
        // redirect to paypal where user approves the transaction
        return this.response.redirect( links[counter].href )
      }
    }
  }
  // En cas d'erreur de paiement
  onError(err){
    console.log("Erreur de paiement : ", err)
    console.log("Détails : ", err.response.details[0])
    return false
  }

  execTransaction(){
    const my = this
    return new Promise( (resolve , reject) => {
      Paypal.payment.create( my.dataTransaction , function(err , payment) {
        if ( err ) reject(err);
        else resolve(payment);
      });
    })
  }

  get dataTransaction() {
    return {
        intent: "authorize"
      , payer: {
          payment_method: "paypal"
        }
      , redirect_urls: {
		      return_url: `http://${App.currentUrl}/paiement/success`
		    , cancel_url: `http://${App.currentUrl}/paiement/failure`
	     }
      , transactions:[
          {
 		          amount: { total: this.montant, currency: "EUR" }
            , description: this.description
 	        }
        ]
    }// fin de data à envoyer pour le paiement
  } // data

  get montant(){
    return 75.00 // à régler
  }
  get description(){
    "Module d'apprentissage « Structure »"
  }
}

module.exports = router
