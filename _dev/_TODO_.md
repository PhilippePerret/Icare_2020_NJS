# Todo list

* Supprimer sur le bureau la candidature supprimée ou validée (peut-être qu'il suffit de rediriger la page)
* Tester la route `/admin/download/<path fichier>` qui permet à l'administrateur de télécharger des documents


– Une signature pour les mails

- Mettre les routes dans un fichier propre
  * voir comment les autres sites s'organisent à ce niveau-là

- Poursuivre le test de l'inscription jusqu'au bout
  * check des mails
  * ajouter le choix du module

- En mode test, ne pas envoyer les mails
  * comment savoir qu'on est en mode test ? (au pire, on pourrait mettre un fichier '.TEST' à la racine, mais bon, c'est lourd, comme version…). Ou plutôt, c'est quand on est en local qu'on ne doit pas les envoyer.
  * Laisser quand même la possibilité de forcer l'envoi même en local.

- Utiliser jQuery pour l'iframe front-tests. Pour notamment pouvoir faire des requêtes ajax facilement
  * dans le code de l'application (le middleware FrontTests) il faut donc toutes les requêtes qui reçoivent ajax.
  * Il faut totalement désactiver FrontTests en production, mais attention quand même à checkFields ? (même si normalement, on n'en a pas besoin).
