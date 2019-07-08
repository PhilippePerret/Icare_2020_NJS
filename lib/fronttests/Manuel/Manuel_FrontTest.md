# Manuel d'utilisation des tests FrontTests

Dernier numéro de note : 0001

* [Introduction, présentation](#introduction_presentation)
* [Installation](#setup_fronttests_for_a_site)
  * [Chargement du middleware](#setting_the_middleware)
  * [Configuration des tests](#configure_tests)
    * [Configuration des tests en Back-end](#config_tests_for_back_end)
    * [Configuration des tests en Front-end](#config_tests_for_front_end)
  * [Lancement des tests (chargement du panneau FrontTests)](#load_tests_panel)
* [Messages de résultat](#resultats_messages)
* [Tests sur le DOM et les DOM elements](#tester_le_dom)
  * [Test des DOM Elements](#tests_on_dom_elements)
    * [Programmer une nouvelle assertion](#new_assertion_for_dom_element)
* [Manipulation des formulaires](#deal_with_forms)
  * [Simuler le choix d'un fichier](#simulate_file_upload)

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


### Configuration des tests {#configure_tests}

Il faut tout d'abord comprendre qu'on peut/doit configurer les tests à deux endroits : pour le back-end, dans le fichier `./config/fronttests.json` et pour le front-end dans le fichier `./lib/fronttests/__config`.

#### Configuration des tests en Back-end {#config_tests_for_back_end}

Pour le back-end, on configure donc les tests dans le fichier `config/fronttest.json` de l'application. C'est une table `JSON` qui peut définir :

`checkIfLocal`
: Méthode qui doit retourner true si on est en local et false dans le cas contraire.

`folderMails`
: Méthode qui doit retourner le path absolu du dossier des mails.
: Note : en mode tests (i.e. en local), les mails ne sont pas envoyés, ils sont enregistrés dans ce dossier.

`folderTickets`
: Méthode qui retourne le path absolu du dossier des tickets.

#### Configuration des tests en Front-end {#config_tests_for_front_end}

On définit la configuration des tests en front-end (donc dans la page contenant les deux iframes) dans le fichier `./lib/fronttests/__config`. C'est également un fichier `JSON` qui définit les propriétés suivantes :

`wishList`
: La liste des paths relatifs (\*) des tests à jouer.
: (\*) depuis le dossier `lib/fronttests/__app_tests__/`

`fail_fast`
: Si cette propriété est mise à `true`, les tests s'interrompent au premier échec.

`runAtLaunch`
: Mettre à true si on veut que les tests soient lancés dès le chargement de la page.

`runAllAtLaunch`
: Mettre à true pour que tous les tests de la `wishList` ci-dessus soient lancés.
: `runAtLaunch` est prioritaire sur cette définission. Il faut la supprimer ou la mettre à false pour pouvoir lancer tous les tests.

### Lancement des tests {#load_tests_panel}

Pour lancer les tests, on n'utilise aucune console, on tape simplement l'adresse de son site en ajoutant le query-string `/ftt` :

```
http://localhost:3000/ftt

```

La fenêtre s'ouvre alors en deux parties, avec à gauche le site lui-même et à droite la section *FrontTests* qui permet de lancer les tests et tout le tintouin.

> Noter que pour le moment, il faut impérativement utiliser l'adresse `localhost:3000` pour lancer l'application et les front-tests.

#### Actualisation de la liste des tests

Pour forcer l'actualisation de la liste des tests, il faut utiliser l'adresse `http://localhost:3000/ftt/update`.

---------------------------------------------------------------------

## Messages de résultat {#resultats_messages}

### Pour écrire une contrainte {#ecrire_une_contrainte}

```javascript

constraint("Cette contrainte doit être respecter")

```

### Pour écrire une action accomplie {#ecrire_une_action}

```javascript

action("J'accomplis telle action")

```

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

### Simuler le choix d'un fichier {#simulate_file_upload}

Pour simuler un fichier on peut utiliser :

```javascript

form.fillWith({
  file_field_name: "long_document.docx"
})

```

Le nom du document doit impérativement être un document se trouvant dans le dossier `lib/fronttests/__app_tests__/support/documents/`.
