'use strict'
/**
  Module de validation

  Class Validator
  Class PropValidator - validateur de propriété
  Class Validate

**/
const path = require('path')
const fs = require('fs')

function raise(msg){throw new Error(msg)}


class Validator {
  static get REG_MAIL(){return /^([a-z0-9_\.\-]{4,30})\@([a-z0-9_\.\-]{4,30})\.([a-z]{1,6})$/}
  // static get REG_PSEUDO(){return /^[a-zA-Z0-9_]+$/}
  static get REG_PSEUDO(){return /^([A-zÀ-ÿ0-9]| )+$/}
  static get REG_PATRONYME(){return /^([A-zÀ-ÿ]| )+$/}

  static getValidatorClass(name){
    return eval(name)
  }

// ---------------------------------------------------------------------
//  INSTANCE VALIDATOR

  constructor(req, rep){
    this.requete = req
    this.reponse = rep
    // Pour les erreurs et les messages
    // Liste de tous les validateurs, pour récupérer les valeurs qui sont
    // bonnes
    this.validators = {}
    this.errors  = []
    this.errorsPerProperty = {} // pour les champs
    // Si la propriété request.files est définie (formulaire avec des documents)
    // alors on fait une propriété `files` pour le validator avec en clé le
    // champ et en valeur les données du file.
    // console.log("this.requete.files= ", this.requete.files)
    if ( this.requete.files ) {
      this.files = new Map()
      for (var dfile of this.requete.files ) {
        this.files.set(dfile.fieldname, dfile)
      }
    }
  }

  /**
    |
    |
    | Méthode appelée dans le module de validation d'un formulaire
    | qui demande la validation
    |
    |
    @param {Array} properties Liste des propriétés à valider
    @param {Array} outProperties  Liste des propriétés à ne pas valider, mais
                                  qu'il faut connaitre pour que les mixins
                                  fonctionnent, par exemple.
    @param {Object} options       Options éventuelles (non utilisées encore)
  **/
  async validate(properties, outProperties, options){
    for ( var property of [...properties,...outProperties]) {
      Object.assign(this.validators, {[property]: this.validatorOfProperty(property)})
    }
    for ( var property of properties ){
      // On valide — ou pas — la propriété
      await this.validators[property].validate()
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
      case 'password':
        return new PasswordValidator(this)
      case 'patronyme':
        return new PatronymeValidator(this)
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
    |
    | Helpers utilisés par les formulaires pour marquer les champs
    | erronés, pour remettre les valeurs validées, etc.
    |
    |
  **/

  /**
    Appelée depuis le formulaire, cette méthode retourne la valeur à donner
    au champ de la propriété +property+
  **/
  getValue(property){
    // console.log("property=", property)
    if ( this.errorsPerProperty[property] ) {
      return this.errorsPerProperty[property].newValue || this.errorsPerProperty[property].value || ''
    } else {
      // Propriété normale ou onfirmation valide (puisqu'il n'y a pas d'erreur)
      var prop = this.isConfirmation(property) ? this.confirmationProp(property) : property
      return this.validators[prop].value
    }
  }
  /**
    Appelée depuis le formulaire, retourne la valeur à donner au champ
    hidden pour un input-hidden de fichier, lorsque le fichier a été
    confirmé/validé
  **/
  getValueAsFile(property){
    // Quelle valeur faut-il retourner ? peut-être un truc avec le
    // nom original (originalname) et le nom dans 'uploads' ?
    const value = this.getValue(property)
    return `${value['originalname']}::${value['path']}`
  }
  getFileName(property){
    return this.getValue(property)['originalname']
  }
  // Class CSS à donner au div.row suivant que le champ est erroné ou non
  getClass(property){
    return this.isErrorField(property) ? 'fieldError' : ''
  }

  // Retourne true si +property+ est une propriété erronée, ou
  // sa confirmation.
  isErrorField(property){
    let prop
    if ( this.isConfirmation(property) ) {
      prop = this.confirmationProp(property)
    } else {
      prop = '' + property
    }
    return !!this.errorsPerProperty[prop]
  }
  isNotErrorField(property){return !this.isErrorField(property)}

  /**
    Retourne un message d'erreur, entre parenthèses, à mettre après
    le label de la propriété.
    Noter qu'on met les parenthèses ici pour pouvoir faire simplement :
    `span.warning.tiny= vdt && vdt.getError('property')` dans la vue
    Noter également qu'ici passent aussi les champs de confirmation mais
    qu'ils n'ont pas été validés en tant que tel. C'est le champ de référence
    qui porte cette validation. Par exemple, si mail_confirmation est mauvais,
    c'est la property 'mail' qui va porter l'erreur. Donc il faut faire un
    test ici
  **/
  getError(property){
    if ( this.isErrorField(property) === false || this.isConfirmation(property) ) return ''
    else return ` (${this.errorsPerProperty[property].error})`
  }

  isConfirmation(property){
    return property.endsWith('_confirmation')
  }
  // Reçoit 'mail_confirmation' et retourne 'mail'
  confirmationProp(property){
    return property.replace(/_confirmation$/,'')
  }
  /**
    |
    |
    | Méthodes de traitement des erreurs
    |
    |
    |
  **/

  /**
    Ajout d'une erreur
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

/** ---------------------------------------------------------------------
  |
  |
  |
  | Les validateurs de propriété
  |
  |
  |
**/

class PropValidator {
  constructor(validator, property){
    this.validator = validator
    this.property  = property
    // console.log("Instanciation du validateur de la propriété ", property)
    // console.log("this.requete.files = ", this.requete.files)
    // console.log("this.validator.files = ", this.validator.files)
    // console.log(`this.validator.files.get('${property}') = `, this.validator.files.get(property))
    // Si c'est un fichier
    if ( this.validator.files && this.validator.files.has(property)) {
      // Pour un input-file
      this.value = this.validator.files.get(property)
    } else {
      // Pour un autre champ normal
      this.value = this.requete.body[this.property]
      if (this.value) this.value = this.value.trim()
      // la confirmation, if any (utile pour `isConfirmed`)
      this.value_confirmation = this.requete.body[`${this.property}_confirmation`]
      if (this.value_confirmation) this.value_confirmation = this.value_confirmation.trim()
    }
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

  /** ---------------------------------------------------------------------
    |
    |
    |
    | Les méthodes de validation
    |
    |
    |
  **/

  isEqual(expected, params){
    if ( this.value !== expected ) {
      return this.addError(params, `${this.human_name} devrait être égal à ${expected} (il vaut ${this.value})`)
    }
  }
  isNotEmpty(params){
    if ( !this.value || this.value.length === 0) {
      return this.addError(params, `${this.human_name} ne devrait pas être vide`)
    }
  }
  isGreaterThan(expected, params){
    if (!this.value || this.value.length <= expected) {
      return this.addError(params, `${this.human_name} doit faire plus de ${expected} signes, il en fait ${this.value.length}`)
    }
  }
  isShorterThan(expected, params){
    if (!this.value || this.value.length >= expected) {
      return this.addError(params, `${this.human_name} doit faire moins de ${expected} signes, il en fait ${this.value.length}`)
    }
  }
  isMatching(regexp, params){
    // console.log("this.value, regexp = ", this.value, regexp)
    if ( this.value.match(regexp) === null) {
      console.log("Ça ne matche pas.")
      return this.addError(params, `${this.human_name} n’est pas valide`)
    }
  }
  isConfirmed(params){
    if ( this.value !== this.value_confirmation ) {
      return this.addError(params, `${this.human_name} n’est pas correctement confirmé`)
    }
  }
  isRequired(params){
    if ( !this.value ) {
      return this.addError(params, `${this.human_name} est absolument requis`)
    }
  }
  isValidFile(expectedh, params){
    // Confirme que le fichier de la propriété courante correspond aux
    // exigences de la table expectedh qui peut contenir :extensions, les
    // extensions acceptées, :min_size, la taille minimum supportée, :max_size
    // la taille maximales acceptée etc.

    // Mais si la valeur est un string, c'est que le fichier a déjà été
    // confirmée.
    if ( typeof this.value === 'string' ) return true

    // Sinon, c'est bien un fichier qu'il faut vérifier
    expectedh = expectedh || this.isValidFile.data
    const file = this.value
    // console.log("[isValidFile] this.value, expectedh = ", this.value, expectedh)
    if ( expectedh.extensions ) {
      // Le fichier doit avoir l'extension attendue
      var extension = path.extname(file['originalname'])
      if ( expectedh.extensions.includes(extension) === false ) {
        return this.addError(params, `${this.human_name} n’est pas d’un format valide (${extension}). Formats possibles : ${expectedh.extensions.join(', ')}.`)
      }
    }
    if ( expectedh.max_size ) {
      if ( file['size'] > expectedh.max_size ) {
        return this.addError(params, `${this.human_name} est trop long (${file['size']} octets). Taille maximale : ${expectedh.max_size} octets.`)
      }
    }
    if ( expectedh.min_size ) {
      if ( file.size < expectedh.min_size ) {
        return this.addError(params, `${this.human_name} est trop court (${file.size} octets). Taille minimale : ${expectedh.min_size} octets.`)
      }
    }

  }
  async isUniq(params){
    // Cette validation particulière a besoin de connaitre la table DB dans
    // laquelle on doit chercher les données. Elle doit être définie par
    // l'application, p.e. dans support/app/validator.js, dans la propriété
    // Validator.tablePerProperty
    Validator.TablePerProperty || raise("Il faut impérativement définir `Validator.TablePerProperty` pour pouvoir utiliser le validateur `isUniq`.")
    let [table, column] = Validator.TablePerProperty[this.property]
    table || raise(`Il faut impérativement définir Validator.TablePerProperty['${this.property}'] pour pouvoir checker la propriété "${this.property}."`)
    let ret2 = await DB.getWhere(table, {[column]: this.value}, ['id', 'pseudo', 'patronyme'])
    // console.log(`ret2 avec ${column} et ${this.value}`, ret2)
    if ( ret2.length > 0 ){
      return this.addError(params, `${this.human_name} doit être unique`)
    }
  }
}

class TokenValidator extends PropValidator {
  constructor(validator){super(validator,'token')}
  get human_name(){return 'le token du formulaire'}
  get conditions(){return [
    ['isEqual', this.requete.session.form_token, {error:"Le formulaire est invalide."}]
  ]}
}

class MailValidator extends PropValidator {
  constructor(validator){super(validator,'mail')}
  get human_name(){return "le mail"}
  get conditions(){return [
        ['isRequired']
      , ['isMatching', Validator.REG_MAIL]
      , ['isUniq', {error: 'le mail existe déjà, vous ne pouvez pas l’utiliser'}]
      , ['isConfirmed']
  ]}
}
class PseudoValidator extends PropValidator {
  constructor(validator){super(validator,'pseudo')}
  get human_name(){return "le pseudo"}
  get conditions(){return [
        ['isRequired']
      , ['isMatching', Validator.REG_PSEUDO]
      , ['isGreaterThan', 3]
      , ['isShorterThan', 31]
      , ['isUniq', {error: 'ce pseudo ne peut pas être utilisé'}]
  ]}
}

class PatronymeValidator extends PropValidator {
  constructor(validator){super(validator,'patronyme')}
  get human_name(){return 'le patronyme'}
  get conditions(){return [
      ['isGreaterThan', 4]
    , ['isShorterThan', 31]
    , ['isUniq', {error: 'ce patronyme est déjà porté'}]
  ]}
}

class PasswordValidator extends PropValidator {
  constructor(validator){super(validator,'password')}
  get human_name(){return 'le mot de passe'}
  get conditions(){return [
      ['isRequired']
    , ['isShorterThan', 30]
    , ['isGreaterThan', 6]
    , ['isConfirmed']
  ]}
}

class FileValidator extends PropValidator {
  constructor(validator, property){super(validator, property)}
  get human_name(){return this._human_name || `le document "${this.property}"`}
  set human_name(v){ this._human_name = v}
  get conditions(){return this._conditions || [
      ['isRequired']
    , ['isValidFile']
  ]}
  set conditions(v){this._conditions = v}
}

module.exports = Validator
