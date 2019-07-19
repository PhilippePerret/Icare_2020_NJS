'use strict'
/**
  |
  |
  | Class AbsEtape
  |
  | Gestion des étapes absolues des modules absolus
  |
  | Note : les méthodes de contrôleur sont chargées en bas de ce module
**/
class AbsEtape {
  constructor(id){
    this.id = id
  }
  /**
    Chargement des données
  **/
  async getData(){
    this.data = await DB.get('icare_modules.absetapes', this.id)
  }
  // Définition des données, lorsqu'elles ont été chargées avant, par exemple
  // pour un groupe d'étapes.
  setData(hdata){
    this.data = hdata
  }

  /**
    |
    | Propriétés fixes (enregistrées)
    |
    |
  **/
  get absModuleId() {return this.data.module_id}
  get numero()      {return this.data.numero}
  get titre()       {return this.data.titre}
  get travail()     {return this.data.travail}
  get travaux()     {return this.data.travaux}
  get objectif()    {return this.data.objectif}
  get methode()     {return this.data.methode}
  get duree()       {return this.data.duree}
  get duree_max()   {return this.data.duree_max}
  get liens()       {return this.data.liens}



  /**
    |
    |
    | Méthode d'helpers
    |
    |
  **/
  /**
    Affichage de l'étape

    C'est la méthode qui doit être appelée pour afficher l'étape, que ce soit
    pour l'icarien(ne) ou pour l'administrateur. Les deux affichages doivent
    absolument correspondre.
  **/
  formatedDisplay(){
    try {
      const Ejs = require('ejs')
      var card = []
      var template = Sys.reqTemplate('modules/etape_visualisation.ejs')
      var code = Ejs.render(template, {etape: this})
      card.push(code)

      // card.push('<div class="etape">')
      // card.push(`<div class="tools-buttons"><a href="javascript:return toggleEdition(${this.numero})">édit</a><a href="">détruire</a></div>`)
      // card.push(`<div class="numero"><label>Numéro</label><span>${this.numero}</span>`)
      // card.push(`<div class="titre"><label>Titre</label><span>${this.titre}</span></div>`)
      // card.push(`<div class="objectif"><label>Objectif</label><span>${this.objectif}</span></div>`)
      // En mode administration, on doit indiquer les classes pour savoir
      // si l'on doit afficher la version normale ou le formulaire
      this.classSectionVisualisation = 'visible'
      this.classSectionEdition = 'hidden'
    } catch (e) {
      // Si on a un problème en essayant d'afficher l'étape, on indique
      // une erreur.
      // Et, pour l'administrateur, on affiche la version formulaire pour
      // que la correction puisse être faite. Plutôt en online
      console.log("--- ERREUR : ", e)
      this.classSectionVisualisation = 'hidden'
      this.classSectionEdition = 'visible'

    } finally {

      // Pour "fermer" le div de la carte
      card.push('</div>')
      card = card.join('')

    }
    return card
  }
  formatedEdition(){
    return '<p>C’est l’étape en version édition</p>'
  }
}

Object.assign(AbsEtape, Sys.reqController('AbsEtape'))

module.exports = AbsEtape
