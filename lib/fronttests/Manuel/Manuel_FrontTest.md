# Manuel d'utilisation des tests FrontTests

* [Introduction, présentation](#introduction_presentation)
* [Installation](#setup_fronttests_for_a_site)
  * [Chargement du middleware](#setting_the_middleware)
  * [Lancement des tests (chargement du panneau FrontTests)](#load_tests_panel)


## Introduction, présentation {#introduction_presentation}

FrontTests est un utilitaire de plus pour des tests d'intégration.

L'originalité et l'intérêt de ces tests tient au fait qu'il se font à côté du site testé, comme si on était réellement un utilisateur en train de se servir du site.

---------------------------------------------------------------------

## Installation de FrontTests pour un site {#setup_fronttests_for_a_site}

### Chargement du middleware {#setting_the_middleware}

Pour installer FrontTests, il suffit :

* de dupliquer le dossier `fronttests` complet dans le dossier `lib` de l'application/du site ([1])
* d'ajouter dans le code de l'application, avant les routes, le middleware [2] :

    ```javascript

    const FrontTests = require('./lib/fronttests/lib/middleware')
    app.use(FrontTests)

    ```

> [1] Il faut avoir défini ce dossier comme le dossier des assets à l'aide de `app.use('/assets', express.static(__dirname + '/lib'))` placé avant ce use.

> [2] Plus tard, lorsqu'on aura un vrai package, on pourra faire simplement `const FrontTests = require('fronttests')`.

### Lancement des tests {#load_tests_panel}

Pour lancer les tests, on n'utilise aucune console, on tape simplement l'adresse de son site en ajoutant le query-string `ftt=1` ou `ftt=true` :

```
http://localhost:3000?ftt=true

```

La fenêtre s'ouvre alors en deux parties, avec à gauche le site lui-même et à droite la section *FrontTests* qui permet de lancer les tests et tout le tintouin.
