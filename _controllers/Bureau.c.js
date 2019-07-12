'use strict'
/**
  Contrôleur du Bureau
**/
const Bureau = {
  homeSection(req,res){
    res.render('bureau', {section:'home'})
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
, workSection(req,res){
    res.send("Je dois afficher la section de travail du bureau")
  }
}
module.exports = Bureau
