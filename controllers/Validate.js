'use strict'
/**
  Module de validation

  Class Validator
  Class PropValidator - validateur de propriété
  Class Validate

**/
function raise(msg){throw new Error(msg)}


class Validate {

static token(in_session, in_form){
  new Validate(
    'token', "Le token du formulaire", in_form,
    [
      ['isEqual', in_session]
    ]
  ).evaluate()
}
static async mail(mail, confirmation){
  return await new Validate(
    'mail', "Le mail", mail.toLowerCase(),
    [
      'notEmpty',
      'isString',
      ['isShorterThan', 51],
      ['isMatching', this.REG_MAIL],
      ['isConfirmedBy', confirmation],
      ['isUniq', 'icare_users.users', 'mail']
    ]
  ).evaluate()
}
static async pseudo(pseudo){
  return await new Validate(
    'pseudo', "Le pseudo", pseudo.trim(),
    [
      'notEmpty',
      'isString',
      ['isShorterThan', 31],
      ['isGreaterThan', 3],
      ['isMatching', this.REG_PSEUDO],
      ['isUniq', 'icare_users.users', 'pseudo']
    ]
  ).evaluate()
}

static get REG_MAIL(){return /^([a-z0-9_\.\-]{4,30})\@([a-z0-9_\.\-]{4,30})\.([a-z]{1,6})$/}
static get REG_PSEUDO(){return /^[a-zA-Z0-9_]+$/}
// ---------------------------------------------------------------------
// INSTANCES
constructor(property, sujet_name, sujet_value, conditions, err_msg){
  this.property     = property
  this.sujet_name   = sujet_name
  this.sujet_value  = sujet_value
  Array.isArray(conditions) || raise("Les conditions doivent être une liste." + ` (problème avec la propriété "${property}")`)
  this.conditions = conditions
  this.err_msg    = err_msg
}
async evaluate(){
  console.log("-> evaluate ", this.property)
  this.errors = []
  var correct, errMsg, newValue
  var method
  for ( var condition of this.conditions ){
    if ( Array.isArray(condition) ){
      method = condition.shift()
    } else {
      method = '' + condition
      condition = []
    }
    // console.log("Traitement de méthode :", method)
    errMsg = await this[method](...condition)
    // console.log("FIN Traitement de méthode :", method)
    if ( errMsg ){
      this.errors.push({property:this.property, error:errMsg, newValue:newValue})
      // On s'arrête à la première erreur, sur une propriété particulière
      break
    }
  }
  // console.log("<- evaluate ", this.property)
  if ( this.errors.length ) return this.errors
  // Sinon rien
}

isEqual(expected, errmsg){
  if (expected !== this.sujet_value) return errmsg || `${this.sujet_name} devrait être égal à ${expected} (égal à "${this.sujet_value}")`
}
notEmpty(errmsg){
  if (undefined === this.sujet_value) return `${sujet_name} est indéfini…`
  if (this.sujet_value.length == 0) return errmsg || `${this.sujet_name} ne doit pas être vide.`
}
isString(errmsg){
  if (typeof this.sujet_value !== 'string') return errmsg || `${this.sujet_name} devrait être un string.`
}
isMatching(regexp, errmsg){
  console.log(`${this.sujet_value}.match(${regexp})=`,this.sujet_value.match(regexp))
  if ( null === this.sujet_value.match(regexp)) return errmsg || `${this.sujet_name} est invalide.`
}
isShorterThan(max, errmsg){
  if (this.sujet_value.length >= max) return errmsg || `${this.sujet_name} est trop long (${max} signes maximum)`
}
isGreaterThan(min, errmsg){
  if (this.sujet_value.length <= min) return errmsg || `${this.sujet_name} est trop court (au moins ${min + 1} signes)`
}
isConfirmedBy(conf, errmsg){
  if (this.sujet_value !== conf) return errmsg || `${this.sujet_name} ne correspond pas à sa confirmation.`
}
async isUniq(table, column, errmsg){
  console.log("-> isUniq", this.property)
  var ret = await DB.query(`SELECT COUNT(*) FROM ${table} WHERE ${column} = ?`, this.sujet_value)
  // console.log("ret = ", ret)
  ret = ret[0]['COUNT(*)']
  // console.log("ret final = ", ret)
  console.log("<- isUniq", this.property, ret > 0)
  if ( ret > 0 ) return errmsg || `${this.sujet_name} existe déjà, vous ne pouvez pas l’utiliser.`
}

}
module.exports = Validate
