'use strict'

// Extensions valides : ['.txt', '.text', '.odt', '.doc', '.docx', '.pdf', '.md', '.mmd']
const TEXT_EXTENSIONS = ['.txt', '.text', '.odt', '.doc', '.docx', '.pdf', '.md', '.mmd']

const Validator = require('../controllers/Validator')
// TODO : poursuivre pour pouvoir obtenir FileValidator ou alors mettre une
// méthode dans Validator : Validator.getValidatorClass('Name')
const FileValidator = Validator.getValidatorClass('FileValidator')

Validator.TablePerProperty = {
    'mail':   ['icare_users.users', 'mail']
  , 'pseudo': ['icare_users.users', 'pseudo']
}

Validator.prototype.validatorOfAppProperty = function(property){
  let fval
  switch (property) {
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
    default:
      throw new Error(`Impossible de trouver un validateur pour la propriété "${property}"`)
  }
}

module.exports = Validator
