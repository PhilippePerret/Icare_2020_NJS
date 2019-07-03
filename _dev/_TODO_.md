# Todo list

- Pour les documents, quand ils sont bons, il faudrait faire un enregistrement,
  dans le dossier `uploads`, qui contienne les informations du fichier : `<uuid>.json` = {filename:, size: etc.}. Et on le remonte toujours à la page.

- Utiliser jQuery pour l'iframe front-tests. Pour notamment pouvoir faire des requêtes ajax facilement
  * dans le code de l'application (le middleware FrontTests) il faut donc toutes les requêtes qui reçoivent ajax.
  * Il faut totalement désactiver FrontTests en production, mais attention quand même à checkFields ? (même si normalement, on n'en a pas besoin).

- Vider le dossier `uploads` au début des tests. On sait que c'est le début des tests lorsque c'est la route '/ftt' qui est invoquée.

- Poursuivre l'implémentation du formulaire pour un document
  S'arranger pour avoir un seul `input` et régler son type à `file` quand le document n'a pas été encore soumis ou quand il est invalide et `hidden` lorsqu'il est valide
  - Lorsqu'il est valide :
    - en faire une copie unique dans le dossier upload
    - voir les données qu'il faut mettre dans le input-hidden (peut-être les mêmes que pour les tests, justement, puisque le système semble très semblable)
    - bien indiquer que le document a été validé, pour ne pas avoir à refaire la manipulation

- Renseigner sur le fait que le fichier 'config/validator' doit impérativement s'appeler comme ça et être mis à cet endroit pour définir les différentes choses. C'est lui qui doit se charger d'appeler la classe principale `Validator`, qui devrait être mise dans un package dans "node_module" (ce serait peut-être l'occasion d'essayer d'en faire un, de façon artificille, avant de le mettre sur le net)
