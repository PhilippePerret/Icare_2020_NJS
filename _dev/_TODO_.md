# Todo list


- Poursuivre l'implémentation du formulaire pour un document
  S'arranger pour avoir un seul `input` et régler son type à `file` quand le document n'a pas été encore soumis ou quand il est invalide et `hidden` lorsqu'il est valide
  - Lorsqu'il est valide :
    - en faire une copie unique dans le dossier upload
    - voir les données qu'il faut mettre dans le input-hidden (peut-être les mêmes que pour les tests, justement, puisque le système semble très semblable)
    - bien indiquer que le document a été validé, pour ne pas avoir à refaire la manipulation

- Ajouter le traitement de la date dans `isValidFile`. *A priori*, ça n'est pas vraiment utile.

- Renseigner sur le fait que le fichier 'config/validator' doit impérativement s'appeler comme ça et être mis à cet endroit pour définir les différentes choses. C'est lui qui doit se charger d'appeler la classe principale `Validator`, qui devrait être mise dans un package dans "node_module" (ce serait peut-être l'occasion d'essayer d'en faire un, de façon artificille, avant de le mettre sur le net)
