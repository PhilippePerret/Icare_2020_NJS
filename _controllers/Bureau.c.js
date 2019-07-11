'use strict'
/**
  Contrôleur du Bureau
**/
const Bureau = {
  homeSection(req,res){
    // res.send("Je dois afficher l'accueil du bureau.")
    res.render('gabarit', {place:'bureau'})
  }
, workSection(req,res){
    res.send("Je dois afficher la section de travail du bureau")
  }
, preferencesSection(req,res){
    res.send("Je dois afficher la section des préférences de bureau")
  }
}
module.exports = Bureau
