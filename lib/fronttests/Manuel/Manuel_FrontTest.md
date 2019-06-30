# Manuel d'utilisation des tests FrontTests

Dernier numéro de note : 0001

* [Introduction, présentation](#introduction_presentation)
* [Installation](#setup_fronttests_for_a_site)
  * [Chargement du middleware](#setting_the_middleware)
  * [Lancement des tests (chargement du panneau FrontTests)](#load_tests_panel)
* [Manipulation des formulaires](#deal_with_forms)

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
    app.use('/ftt(/:action)?', FrontTests)

    ```

> [1] Il faut avoir défini ce dossier comme le dossier des assets à l'aide de `app.use('/assets', express.static(__dirname + '/lib'))` placé avant ce use.

> [2] Plus tard, lorsqu'on aura un vrai package, on pourra faire simplement `const FrontTests = require('fronttests')`.

### Lancement des tests {#load_tests_panel}

Pour lancer les tests, on n'utilise aucune console, on tape simplement l'adresse de son site en ajoutant le query-string `/ftt` :

```
http://localhost:3000/ftt

```

La fenêtre s'ouvre alors en deux parties, avec à gauche le site lui-même et à droite la section *FrontTests* qui permet de lancer les tests et tout le tintouin.

> Noter que pour le moment, il faut impérativement utiliser l'adresse `localhost:3000` pour lancer l'application et les front-tests.

Pour forcer l'actualisation de la liste des tests, il faut utiliser l'adresse `http://localhost:3000/ftt/update`.


---------------------------------------------------------------------


# Manipulation des formulaires {#deal_with_forms}

#### [NOTE 0001]

On utilise la même variable `form` par exemple, dans les feuilles de tests. Par exemple :

```javascript

let form = Form.new('#monFormulaire')

```

Le problème est que la page est rechargée et que le formulaire initial n'est plus le même. C'est la raison pour laquelle on initialise toujours `_domobj` afin que l'élément DOM soit toujours recherché dans la page courante.
