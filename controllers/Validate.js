'use strict'
/**
  Module de validation
**/
function raise(msg){throw new Error(msg)}

class Validate {

static token(in_session, in_form){
  new Validate(
    "Le formulaire",
    in_form,
    [
      ['isEqual', in_session]
    ]
  ).evaluate()
}
static mail(mail){
  new Validate(
    "Le mail", mail.toLowerCase(),
    [
      'notEmpty',
      'isString',
      ['isShorterThan', 51],
      ['isMatching', Validate.REG_MAIL]
    ]
  ).evaluate()
}
static pseudo(pseudo){
  new Validate(
    "Le pseudo", pseudo.trim(),
    [
      'notEmpty',
      'isString',
      ['isShorterThan', 30],
      ['isGreaterThan', 3],
      ['isMatching', Validate.REG_PSEUDO]
    ]
  ).evaluate()
}

static get REG_MAIL(){return /^([a-z0-9_\.\-])\@([a-z0-9_\.\-])\.([a-z]{1,6})$/}
static get REG_PSEUDO(){return /^[a-zA-Z0-9_]$/}
// ---------------------------------------------------------------------
// INSTANCES
constructor(sujet_name, sujet_value, conditions, err_msg){
  this.sujet_name   = sujet_name
  this.sujet_value  = sujet_value
  Array.isArray(conditions) || raise("Les conditions doivent être une liste.")
  this.conditions = conditions
  this.err_msg    = err_msg
}
evaluate(){
  for ( var condition of this.conditions ){
    if ( Array.isArray(condition) ){
      var method = condition.shift()
      console.log("method, condition = ", method, condition)
      this[method](this.sujet_value, ...condition)
    } else {
      this[condition](this.sujet_value)
    }
  }
}

notEmpty(errmsg){
  undefined !== this.sujet_value || raise(`${sujet_name} est indéfini…`)
  this.sujet_value.length > 0 || raise(errmsg || `${this.sujet_name} ne doit pas être vide.`)
}
isString(errmsg){
  typeof this.sujet_value === 'string' || raise(errmsg || `${this.sujet_name} devrait être un string.`)
}
isMatching(regexp, errmsg){
  this.sujet_value.match(regexp) || raise(errmsg || `${this.sujet_name} est invalide.`)
}
isShorterThan(max, errmsg){
  this.sujet_value.length < max || raise(errmsg || `${this.sujet_name} est trop long (${max} signes maximum)`)
}
isGreaterThan(min, errmsg){
  this.sujet_value.length > min || raise(errmsg || `${this.sujet_name} est trop court (au moins ${min + 1} signes)`)
}
isEqual(expected, errmsg){
  expected === this.sujet_value || raise(errmsg || `${this.sujet_name} devrait être égal à ${expected} (égal à "${this.sujet_value}")`)
}


}
module.exports = Validate
