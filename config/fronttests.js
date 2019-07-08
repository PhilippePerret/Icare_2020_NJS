'use strict'
/**
  Configuration des FrontTests (back-end)

  ATTENTION : ce module ne doit pas être confondu avec le module
  `lib/fronttests/__config` qui sert en front-end

**/
module.exports = {
    name: 'Configuration de FrontTests'
  // Pour savoir si on se trouve en local ou non
  // Normalement, on doit toujours faire les tests en local, mais bon…
  , checkIfLocal: function(){ return Icare.isLocalSite }
  // Le path du dossier temporaire où sont enregistrés les mails
  // (au lieu d'être envoyés)
  , folderMails: function(){return Icare.folderMails}
  , folderTickets: function(){return Icare.folderTickets}
}
