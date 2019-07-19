'use strict'
/**
  |
  |
  | Class Travail
  |
  | Pour la gestion du travail
  |
  |
**/

const IcModule = Sys.reqModel('IcModule') // modèle et contrôleur
const Texte = Sys.reqController('Texte')

class Travail {
  constructor(icmodule, icetape){
    this.icModule   = icmodule
    this.icEtape    = icetape
    this.absModule  = this.icModule.absModule
    this.absEtape   = this.icEtape.absEtape
    console.log("icmodule_id et icetape de l'icarien courant : %d - %d", this.icModule.id, this.icEtape.id)
  }


  /**
    |
    | Méthodes d'helpers
    |
    |
  **/

  /**
    Méthode générale qui met en forme le travail, la minifaq, le quai des
    docs avant d'afficher la vue
    @asynchrone
  **/
  async formate(){
    await this.formateTravail()
    await this.formateMethode()
    await this.formateMinifaq()
    await this.formateQDD()
  }

  formatedTravail(){return this._fwork}
  /**
    @return {HTMLString} Le travail, entièrement formaté
  **/
  async formateTravail(){
    if ( undefined === this._fwork ) {
      // Mettre en forme le travail
      var w = this.absEtape.travail
      this._fwork = await (new Texte(w).formate())
    }
  }

  /**

    @return {HTMLString} La méthode ou les éléments de méthode proposés

  **/
  formatedMethode(){ return this._fmethod }

  async formateMethode(){
    if (this.absEtape.methode) {
      this._fmethod = '[méthode à mettre en forme]'
    } else {
      this._fmethod = 'Aucun élément de méthode n’est proposé pour cette étape.'
    }

  }

  /**

    @return {HTMLString} Les liens proposés pour l'étape, mis en forme

  **/
  formatedLinks(){
    if (undefined === this.flinks) {
      if (this.absEtape.liens && this.absEtape.liens.length > 0) {
        this.flinks = this.absEtape.liens.join('') // TODO
      } else {
        this.flinks = 'Aucun lien n’est proposé pour cette étape.'
      }
    }
    return this.flinks
  }

  /**

    @return {HTMLString} Les liens pour télécharger les documents du QDD
                          propres à l'étape
  **/
  formatedQDD(){return this._fqdd}
  async formateQDD(){
    this._fqdd = "[Ici, bientôt, les documents de l'étape dans le QDD]"
  }

  /**

    @return {HTMLString} La minifaq de l'étape

  **/
  minifaq(){ return this._minifaq }
  async formateMinifaq(){
    this._minifaq = "[Bientôt ici la minifaq de l'étape]"
  }

  /**

    @return {String} La date de démarrage de l'étape formatée

  **/
  formatedStartAt(){
    return this._fstartat || ( this._fstartat = Date.formate('F à T', this.icEtape.startedAt * 1000))
  }

  /**

    @return {String}  Le texte "il y a .... jours" permettant de savoir
                      quand a été commencé l'étape

  **/
  formatedIlya(){
    if ( undefined === this._ilya ) {
      var nombre_jours = Math.round((Date.now() - (this.icEtape.startedAt * 1000)) / (24 * 3600 * 1000))
      this._ilya = ` (il y a ${nombre_jours} jours)`
    }
    return this._ilya
  }

  /**

    @return {String} La date de fin attendue de l'étape, formatée

  **/
  formatedExpectedAt(){
    return this._fexpat || (this._fexpat = Date.formate('F à T', this.icEtape.expectedEnd * 1000))
  }

  /**

    @return {String} Le texte "dans x jours" pour définir l'échéance

  **/
  formatedEcheanceDans(){
    if ( undefined === this._echedans ) {
      var nombre_jours = Math.round(((this.icEtape.expectedEnd * 1000) - Date.now()) / (24 * 3600 * 1000))
      if ( nombre_jours < 0 ) {
        this._echedans = ` <span class="warning">(aurait dû être remis il y a ${-nombre_jours} jours ! <a href="/bureau/change_echeance">modifiez votre échéance</a>)</span>`
      } else if ( nombre_jours === 0 ) {
        this._echedans = ` (aujourd’hui)`
      } else {
        this._echedans = ` (dans ${nombre_jours} jours)`
      }
    }
    return this._echedans
  }

  /**

    @return {String}  La date de fin réelle de l'étape, formatée (donc seulement
                      quand l'étape a été terminée, pour l'historique)

  **/
  formatedEndAt(){
    return this._fendat || (this._fendat = Date.formate('F à T', this.icEtape.endedAt * 1000))
  }

}

Object.assign(Travail, Sys.reqController('Travail'))

module.exports = Travail
