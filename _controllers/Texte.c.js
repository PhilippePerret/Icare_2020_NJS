'use strict'
/**
  Module de traitement des textes, mise en forme
**/
const Ejs = require('ejs')

class Texte {
  constructor(str){
    this.raw = str
  }
  async getTravailType(rubrique, travail){
    return `C'est le travail type ${travail} de la rubrique ${rubrique}`
  }
  /**
    Retourne l'instance formatée HTML
  **/
  async formate(){
    const my = this

    // On ne peut pas faire la formule ci-dessous car c'est trop compliqué
    // ensuite de gérer toutes les fonctions. Par exemple pour les travaux
    // type, il faudrait les mettre avec les arguments explicites (le package
    // ERB est une horreur, visiblement)
    // Donc il faut procédé avant en retreivant tous les travaux types
    // return await Erb({template: this.raw})

    this.formated = String(this.raw)

    await my.remplaceTravauxType()

    // await my.deserb()

    return this.formated
  }
  /**
    Méthode qui ne fait que remplacer les travaux-types (la balise) par
    le code brut du travail type.
  **/
  async remplaceTravauxType(){
    var str = this.formated

    // === 1. récupération des travaux-type ===
    //
    var travauxType = []
    let regex = /<\%\= ?travail_type ?'([a-zA-Z_]+)', ?'([a-zA-Z_]+)' ?\%>/g
    let match = []
    while ( match = regex.exec(str) ) {
      console.log("match = ", match)
      var dttype = {balise:match[0], rubrique:match[1], shortName:match[2]}
      var res = await DB.getWhere('icare_modules.abs_travaux_type', {rubrique:dttype.rubrique, short_name:dttype.shortName})
      Object.assign(dttype, {data:res[0]})
      console.log("dttype : ", dttype)
      travauxType.push(dttype)
    }

    // === 2. On remplace les balises par les textes ===
    // Mais les textes non formatés, puisqu'on les formatera
    // dans un second temps. Mais on s'assure quand même qu'ils
    // ne contiennent pas, eux-mêmes des travaux
    for( const travailType of travauxType ) {
      var regexp = new RegExp(travailType.balise)
      var remp = await new Texte(travailType.data.travail).remplaceTravauxType()
      str = str.replace(regexp, remp)
    }

    this.formated = str

    return this.formated
    // pour les boucles profondes, par exemple les travaux-type qui se
    // trouveraient dans des tableaux type.
  }

  /**
    Formate le code ERB contenu dans le 'formated' de l'instance
  **/
  async deserb(){
    this.formated = await Erb({
      template: this.formated
    })
    return this.formated
    // Pour un texte qui nécessiterait de n'être que déserbé
  }
}

module.exports = Texte
