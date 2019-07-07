'use strict'
/**
  Configuration des FrontTests

**/

export const FrontTestsConfig = {
    // Mettre ici la liste des tests à jouer. Le bouton "LANCER" jouera toujours
    // le premier, le bouton "LANCER TOUS" jouera toute la liste.
    wishList: [
        'app/user/signup/acceptation.test.js'
      , 'app/user/signup/full.test.js'
      , 'app/tickets/base.test.js'
      , 'app/user/signup/documents.test.js'
    ]
  , fail_fast: true
}
