# Manuel d'utilisation des tests FrontTests

Dernier numéro de note : 0001

* [Introduction, présentation](#introduction_presentation)
* [Installation](#setup_fronttests_for_a_site)
  * [Chargement du middleware](#setting_the_middleware)
  * [Lancement des tests (chargement du panneau FrontTests)](#load_tests_panel)
* [Tests sur le DOM et les DOM elements](#tester_le_dom)
  * [Test des DOM Elements](#tests_on_dom_elements)
    * [Programmer une nouvelle assertion](#new_assertion_for_dom_element)
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

## Tests sur le DOM et les DOM elements {#tester_le_dom}

Les tests du DOM se font avec la classe `Dom`. Par exemple :

```javascript

Dom.hasText("Le texte qu'on doit trouver dans la page.")

```

### Test des DOM Elements {#tests_on_dom_elements}


Les tests des éléments DOM se font principalement avec l'objet :

```javascript

Dom.element("#monDiv")

```

Par exemple :

```javascript

Dom.element('#monDiv').hasClass(['uneclass','autrecss'])

```

Voir dans le fichier de toutes les expectations et assertions les méthodes de test utilisables.

### Programmer une nouvelle assertion {#new_assertion_for_dom_element}

Si l'on veut par exemple utiliser une nouvelle assertion qui serait `seTrouveAvant(selector)` qui s'utiliserait de cette façon :

```javascript

Dom.element('#monDiv').seTrouveAvant('#autreDiv')

```

On programmerait dans le dossier `support/app` la nouvelle assertion avec :

```javascript

Objet.assign(DomElement.prototype,{
  // Renseigner la méthode avec la syntaxe ci-dessous pour produire les fichiers
  // de toutes les expectations et assertions.
  /*  
    @method Dom.element(selector).seTrouveAvant(expected, options)
    @description Produit un succès si l'élément +selector+ se trouve avant l'élément +expected+
    @provided
      :expected {String} Sélecteur de l'élément de référence
      :options {Options} Les [options classiques des assertions](#options_assertions)
    @usage Dom.element('#MonDiv').not.seTrouveAvant('#autreDiv')
   */
  seTrouveAvant(selector, options){
    var pass = /* on estime si l'élément se trouve avant */
    new Assertion(
    pass
  , this.positive
  , {
      pos_success: `${this.sujet} se trouve bien avant ${selector}`
    , neg_success: `${this.sujet} ne se trouve pas avant ${selector}`
    , pos_failure: `${this.sujet} devrait se trouvant avant ${selector}`
    , neg_failure: `${this.sujet} ne devrait pas se trouvant avant ${selector}`
    }
  ).evaluate(options)

  }
})

```


---------------------------------------------------------------------


## Manipulation des formulaires {#deal_with_forms}

#### [NOTE 0001]

On utilise la même variable `form` par exemple, dans les feuilles de tests. Par exemple :

```javascript

let form = Form.new('#monFormulaire')

```

Le problème est que la page est rechargée et que le formulaire initial n'est plus le même. C'est la raison pour laquelle on initialise toujours `_domobj` afin que l'élément DOM soit toujours recherché dans la page courante.
