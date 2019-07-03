'use strict'

module.exports = {
    name: 'Fichier de configuration de Mail'
  // Entête pour les sujets de mail
  , subject_header: "[ICARE] "
  // Pour savoir si on utilise les mails en local ou non
  , checkIfLocal: function(){ return Icare.isLocalSite }
  // Mettre à true pour envoyer les mails même en local (localhost)
  , sendEvenLocal: false
  // Le path du dossier temporaire (où, notamment, doivent être enregistrés
  // les mails quand ils ne sont pas envoyés)
  , folderTmp: function(){return Icare.folderMails}
}
