# Todo des tests FrontTests

- plutôt que des query-string, utiliser des url : "/ftt" pour lancer les tests, "/fronttests" pour charger la page. Voir comment on gère les routes dans les midlewares.

- Mettre en place la sélection de test par expression régulière

- Documenter la façon de programmer un test

- Faire un menu pour choisir le test à jouer

- [SUPPORT] De la même manière qu'on relève les tests (liste) on doit faire un fichier qui va charger les supports, ou alors faire un dossier 'support' contenant un fichier 'required' qui sera toujours charger (et donc il faut le renseigner pour charger ce qu'on veut)

- Dans `frame.html`, il faudrait pouvoir régler de façon dynamique l'adresse du site (pour le moment, c'est bloqué à 'localhost:3000/').
