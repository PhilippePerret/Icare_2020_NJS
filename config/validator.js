'use strict'

const TEXT_EXTENSIONS = ['.txt', '.text', '.odt', '.doc', '.docx', '.pdf', '.md', '.mmd']

const Validator = require('../controllers/Validator')
// TODO : poursuivre pour pouvoir obtenir FileValidator ou alors mettre une
// méthode dans Validator : Validator.getValidatorClass('Name')
const FileValidator = Validator.getValidatorClass('FileValidator')
    , PropValidator = Validator.getValidatorClass('PropValidator')

Validator.TablePerProperty = {
    'mail':   ['icare_users.users', 'mail']
  , 'pseudo': ['icare_users.users', 'pseudo']
}

Validator.prototype.validatorOfAppProperty = function(property){
  let fval
  switch (property) {
    case 'patronyme':
      return new PropValidator(this,'patronyme')
    case 'presentation':
      fval = new FileValidator(this, 'presentation')
      fval.human_name = 'le document de présentation'
      fval.isValidFile.data = {
        extensions: TEXT_EXTENSIONS, max_size: 500000, min_size: 1000
      }
      return fval
    case 'motivation':
      fval = new FileValidator(this, 'motivation')
      fval.human_name = 'le document « lettre de motivation »'
      fval.isValidFile.data = {
        extensions: TEXT_EXTENSIONS, max_size: 500000, min_size: 1000
      }
      return fval
    case 'extraits':
      fval = new FileValidator(this, 'extraits')
      fval.human_name= 'le document des extraits'
      return fval
    default:
      throw new Error(`Impossible de trouver un validateur pour la propriété "${property}"`)
  }
}

module.exports = Validator
