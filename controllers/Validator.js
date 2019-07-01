'use strict'
/**
  Module de validation

  Class Validator
  Class PropValidator - validateur de propriété
  Class Validate

**/
function raise(msg){throw new Error(msg)}


class Validator {
  static get REG_MAIL(){return /^([a-z0-9_\.\-]{4,30})\@([a-z0-9_\.\-]{4,30})\.([a-z]{1,6})$/}
  static get REG_PSEUDO(){return /^[a-zA-Z0-9_]+$/}

// ---------------------------------------------------------------------
//  INSTANCE

  constructor(req, rep){
    this.requete = req
    this.reponse = rep
    // Pour les erreurs et les messages
    // Liste de tous les validateurs, pour récupérer les valeurs qui sont
    // bonnes
    this.validators = {}
    this.errors  = []
    this.errorsPerProperty = {} // pour les champs
  }
  // La méthode principale qui appelle la propriété à valider
  async validate(properties, options){
    for ( var property of properties ){
      // On valide — ou pas — la propriété
      Object.assign(this.validators, {[property]: this.validatorOfProperty(property)})
      this.validators[property].validate()
    }
  }
  validatorOfProperty(property){
    switch (property) {
      case 'token':
        return new TokenValidator(this)
      case 'mail':
        return new MailValidator(this)
      case 'pseudo':
        return new PseudoValidator(this)
      default:
        if ( typeof this.validatorOfAppProperty === 'function' ) {
          // Les propriétés propres à l'application
          return this.validatorOfAppProperty(property)
        } else {
          throw new Error(`Impossible de trouver un validateur pour la propriété "${property}"`)
        }
    }
  }

  hasErrors(){return this.errors.length > 0}

  /**
    Appelée depuis le formulaire, cette méthode retourne la valeur à donner
    au champ de la propriété +property+
  **/
  getValue(property){
    if ( this.errorsPerProperty[property] ) {
      return this.errorsPerProperty[property].newValue || this.errorsPerProperty[property].value || ''
    } else {
      return this.validators[property].value
    }
  }
  getClass(property){
    return this.errorsPerProperty[property] ? 'fieldError' : ''
  }
  /**
    On ajoute une erreur
    @param {PropValidator} propV L'instance de validateur de propriété
    @param {Object} params  Les paramètres. Contient notamment :error, le
                            message de l'erreur rencontrée et :silence qui
                            indique qu'il ne faut pas donner le message d'erreur
    @param {String} errMsg  Le message d'erreur normal, si params.error n'est
                            pas explicitement défini.
  **/
  addError(propValidator, params){
    this.errors.push({propv: propValidator, params:params, error:params.error})
    Object.assign(this.errorsPerProperty, {[propValidator.property]: propValidator})
  }

  /**
    Retourne la liste humaine des erreurs, pour l'affichage en haut de la
    page.
  **/
  get humanErrorList(){
    return '&emsp;• ' + this.errors.map(err => err.error).join('<br/>&emsp;• ')
  }


}

// ---------------------------------------------------------------------

class PropValidator {
  constructor(validator, property){
    this.validator = validator
    this.property  = property
    this.value     = this.requete.body[this.property]
  }
  get requete(){return this.validator.requete}
  get reponse(){return this.validator.reponse}

  // L'erreur rencontrée au cours de cette validation
  get error(){return this._error}
  addError(params, defaultErrorMessage){
    params = params || {}
    this._error = params.error || defaultErrorMessage
    Object.assign(params, {error: this.error})
    this.validator.addError(this, params)
    return false // pour interrompre la validation de cette propriété
  }
  /**
    On passe en revue toutes les conditions à valider
  **/
  async validate(){
    for (var condition of this.conditions){
      var method = condition.shift()
      // console.log("method = ", method)
      if (await this[method](...condition) === false) break
    }
  }

  isEqual(expected, params){
    if ( this.value !== expected ) {
      return this.addError(params, `${this.human_name} devrait être égal à ${expected} (il vaut ${this.value})`)
    }
  }
  isNotEmpty(params){
    if ( !this.value || this.value.length === 0) {
      return this.addError(params, `${this.human_name} ne devrait pas être vide.`)
    }
  }
  isGreaterThan(expected, params){
    if (!this.value || this.value.length <= expected) {
      return this.addError(params, `${this.human_name} doit faire plus de ${expected} signes (il en fait ${this.value.length}).`)
    }
  }
  isShorterThan(expected, params){
    if (!this.value || this.value.length >= expected) {
      return this.addError(params, `${this.human_name} doit faire moins de ${expected} signes (il en fait ${this.value.length}).`)
    }
  }
  isMatching(regexp, params){
    if ( this.value.match(regexp) === null) {
      return this.addError(params, `${this.human_name} n’est pas valide.`)
    }
  }
  isRequired(params){
    if ( !this.value ) {
      return this.addError(params, `{this.human_name} est absolument requis.`)
    }
  }
}

class TokenValidator extends PropValidator {
  constructor(validator){super(validator,'token')}
  get human_name(){return 'Le token du formulaire'}
  get conditions(){return [
    ['isEqual', this.requete.session.form_token, {error:"Le formulaire est invalide."}]
  ]}
}

class MailValidator extends PropValidator {
  constructor(validator){super(validator,'mail')}
  get human_name(){return "Le mail"}
  get conditions(){return [
        ['isNotEmpty', {error: 'votre mail est absolument requis'}]
      , ['isMatching', Validator.REG_MAIL]
      , ['isUniq', 'mail']
  ]}
}
class PseudoValidator extends PropValidator {
  constructor(validator){super(validator,'pseudo')}
  get human_name(){return "Le pseudo"}
  get conditions(){return [
        ['isNotEmpty', {error: 'votre pseudo est absolument requis'}]
      , ['isMatching', Validator.REG_PSEUDO]
      , ['isGreaterThan', 3]
      , ['isShorterThan', 31]
      , ['isUniq', 'pseudo']
  ]}
}
class PasswordValidator extends PropValidator {
  constructor(validator){
    super(validator,'password')
  }
}

module.exports = Validator
