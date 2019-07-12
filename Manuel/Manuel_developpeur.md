# Manuel de développement de l'atelier Icare en version Node.js/Express

* [Utilisateurs/Icariens](#les_utilisateurs)
  * [Tester si l'user courant est admin](#test_if_user_current_admin)
  * [Tester si l'user courant est icarien](#tests_if_current_icarien)
* [Programmation générale](#general_programmation)
  * [Requérir des modules](#require_modules)
  * [Organisation des routers, contrôleurs et modèles](#organisation_routers_ctrl_et_models)
  * [Fonctionnement des modèles et contrôleurs](#fonctionnement_models_et_controllers)
  * [Online ou Offline](#know_if_online_offline)
* [Page et contenu](#page_et_contenu)
  * [Afficher des messages utilisateur](#show_user_messages)
  * [Afficher dans des « grids »](#display_in_grids)
* [Contenu textuel](#contenu_textuel)
  * [Insérer du code HTML dans la page](#insert_html_code_in_page)
  * [Dates formatées](#formated_dates)
* [Bases de données](#les_bases_de_données)
  * [`get`, obtenir une des valeurs (colonnes) avec l'identifiant](#get_values_with_id})
  * [`getAll`, récupérer tous les enregistrement voulus dans une table](#get_all_values)
  * [`update`, actualiser des données](#update_data_in_db)
* [Les fichiers et dossiers](#folders_and_files)
  * [Travailler sur un fichier en le verrouillant](#lock_working_file)
* [Les formulaires](#les_formulaires)
  * [Validation des formulaires](#valider_les_formulaires)
    * [Validateurs propres à l'application](#custom_form_validators)
    * [Validation d’un fichier](#validate_a_file)
    * [Fichier App Validator](#fichier_validator_app)
    * [définir les tables DB de validation](#define_db_tables)
* [Mails](#les_mails)
  * [Envoyer un mail](#send_a_mail)
  * [Configuration des mails](#mail_configuration)
  * [Données de transmission](#mail_connexion_data)
* [Les Tickets](#les_tickets)
  * [Présentation des tickets](#presentation_des_tickets)
  * [Créer un ticket](#creer_un_ticket)
  * [Obtenir le lien du ticket](#get_ticket_link)
* [Les Actualités](#les_news)

---------------------------------------------------------------------

## Utilisateurs/Icariens {#les_utilisateurs}

### Tester si l'user courant est admin {#test_if_user_current_admin}

```javascript

if ( User.admin() )
  // => C'est un administrateur
else
  // => Ce n'est pas un administrateur

```

### Tester si l'user courant est icarien {#tests_if_current_icarien}

```javascript

if ( User.icarien() )
  // Pour un icarien
else
  // Pour un non icarien

```

---------------------------------------------------------------------

## Programmation générale {#general_programmation}

### Requérir des modules {#require_modules}

Pour requérir n'importe quel module sans se soucier le l'endroit d'où on le fait, le plus simple est d'utiliser `System.require` au lieu de `require`. On peut même ne pas mettre le `./`. Le path relatif que l'on transmet à `System.require` s'estime toujours depuis la racine du site, quel que soit l'endroit d'où on appelle la méthode.

Ainsi, quel que soit le module dans lequel on se trouve, la commande `System.require('controllers/MonCont')` appellera toujours le contrôleur `MonCont` se trouvant dans le dossier `controllers` situé à la racine du site.

### Organisation des routers, contrôleurs et modèles {#organisation_routers_ctrl_et_models}

Certaines conventions permettent de faciliter grandement le travail. Elles existent pour les routeurs, les contrôleurs et les modèles.

Dossier
: Les routers, contrôleurs et modèles doivent être placés dans leur dossiers respectifs : `_routers`, `_controllers` et `_models`.

Nom générique
: Ces routers, contrôleurs et modèles doivent avoir un nom générique, caractéristique.
: Par exemple `Bureau` ou `Admin`.

Nom du fichier
: Le nom de leur fichier doit être suivi par la marque de leur nature, c'est-à-dire respectivement : `<chose>.r.js` (`r` pour `router`), `<chose>.c.js` (`c` pour `controller`) et `<chose>.m.js` (`m` pour `model`).
: Par exemple : `Bureau.r.js` (router du Bureau), `User.m.js` (modèle d'user), etc.

Require
: Pour requérir ces modules, si les conventions précédentes sont respectées, il suffit d'utiliser les méthodes respectives `Sys.reqRouter`, `Sys.reqController` et `Sys.reqModel` en mettant en argument le *nom générique* du module.
: Par exemple : `const Bureau = Sys.reqController('Bureau')`
: Noter qu'on n'indique aucune extension, juste le *nom générique*.

### Fonctionnement des modèles et contrôleurs {#fonctionnement_models_et_controllers}

Comme je veux que les contrôleurs et les modèles soient séparés (respectivement dans les dossiers `_controllers` et `_models`), mais que je ne veux pas que ce soit deux objets différents qui soient invoqués suivant qu'on fasse appel au contrôleur ou au modèle, il faut trouver le moyen d'inclure les méthodes de l'un dans l'autre.

Par exemple, dans `_models/User.m.js` est défini le *modèle* `User` tandis que dans `_controllers/User.c.js` est défini le *contrôleur* `UserController`. Mais je veux toujours faire appel à la seule classe `User` même pour invoquer les méthodes de `UserController`.

Pour se faire, il suffit, à la fin de la définition du modèle, d'ajouter :

```javascript

Object.assign(<NomModel>, Sys.reqController('<NomModel>'))

```

Par exemple :

```javascript

Object.assign(User, Sys.reqController('User'))

```

> Noter qu'aucun contrôle de collision n'est effectué ici et que les méthodes du modèle seront inévitablement écrasées par les méthodes du contrôleur qui porteraient le même nom…

### Online ou Offline {#know_if_online_offline}

Pour savoir si on est en online ou en offline, on utilise :

```javascript

App.online // => true si online

App.offline // => true si offline

```

Noter que cette propriété est définie par un middleware, donc on ne peut pas l'atteindre immédiatement dans le module main `app.js`.

---------------------------------------------------------------------

## Page et contenu {#page_et_contenu}

### Afficher des messages utilisateur {#show_user_messages}

Pour afficher des messages utilisateur, le mieux est d'utiliser la classe `Dialog` exposée partout.

Les méthodes utilisables sont les suivants :

`Dialog.annonce("message")`
: Pour un message "bleu"

`Dialog.action_required("action")`
: Quand on demande à l'utilisateur d'accomplir une action.

`Dialog.error("message d'erreur")`
: Pour signaler une erreur.


### Afficher dans des « grids » {#display_in_grids}

Une classe générique `grid6x4` permet de disposer facilement du contenu dans une grille de 6 colonnes sur 4 rangées.

```html

div.grid6x4

```

Ensuite, on doit définir par les classes le nombre et le choix des colonnes et des rangées. C'est extrèmement simple : si l'on veut qu'un div s'étendent sur de la colonne 2 à la colonne 4 et de la rangée 2 à la rangée 3, il suffit de faire :

* colonnes 2 à 4 => `cols2a4`
* rangées 2 à 3 => `rows2a3`

D'où :

```html

div.grid6x4
  div.cols2a4.rows2a3

```

> Pour le moment 1/ on ne peut utiliser que des `div` (mais ce serait hyper simple de changer) et 2/ il n'existe que le patron 6 par 4, qui permet une grand souplesse, mais on pourrait aussi en imaginer d'autres au besoin.

---------------------------------------------------------------------

## Contenu textuel {#contenu_textuel}

### Insérer du code HTML dans la page {#insert_html_code_in_page}

```javascript

!= PUG.render("<p>Du code HTML</p>")

```

> Note : 1/ qu'il faut impérativement que le code commence par `<` et 2/ que le texte ne contienne aucun retour chariot (s'inspirer de l'exemple suivant si c'est le cas).

Par exemple

```javascript

div.leDivPrincipal
  != PUG.render(`${instance.codeHTML.replace(/[\n\r]/g,' ')}`)

```

### Dates formatées {#formated_dates}

Des méthodes pratiques ont été ajoutées pour formater les dates.

```javascript

Date.formate([format[, date]])

```

Noter que le format est donné en premier. Pour le format par défaut, mettre `null` ou `undefined` comme valeur. Cela par du principe qu'on utilise la méthode plus souvent pour formater le temps courant (ce qui est faux, en vrai, dans la vraie vie…).

Le format utilise :

```
  F     Pour : jour sur 2 chiffres, mois sur 2 chiffres, années sur 4 chiffres
  T     Pour le temps : h:mm
        Par exemple, "le F à T" retournera quelque chose comme :
        "le 20 07 2019 à 3:45"
  JJ    Jour sur deux chiffres
  J     Jour en un ou deux chiffres
  MM    Mois sur deux chiffres
  M     Mois en un ou deux chiffres
  MH    Mois humain
  YY    Année sur 2 chiffres
  YYYY  Année sur 4 chiffres

  h     Heure sur un chiffre ou plus
  mm    Minutes sur deux chiffres
  ss    Secondes sur deux chiffres
```

Si aucune date n'est précisée, c'est la date et le temps courant qui sont pris.

Par exemple :

```javascript

Date.formate('J/MM/YYYY h:mm:ss')
// => "7/07/2019 13:52:22"

```

Format par défaut : `J/MM/YYYY h:mn`

---------------------------------------------------------------------

## Bases de données {#les_bases_de_données}

On atteint les données des bases de données grâce à l'objet `DB` (qui utilise `mysql-easier`).

Une requête prend la forme :

```javascript

var resultat = await DB.query(requête[, paramètres[, database]])

```

Par exemple :

```javascript

const Phil = await DB.query("SELECT * FROM users WHERE id = ?", [1], 'icare_users')

```

### `get`, obtenir une des valeurs (colonnes) avec l'identifiant {#get_values_with_id}

```javascript

var retour = await DB.get(table, id[, ArrayColonnes])

```

Par exemple :

```javascript

var retour = await DB.get('icare_users.users', 12, ['session_id', 'pseudo'])
// => retour.session_id : l'identifiant de session enregistré
//    retour.pseudo : le pseudo de l'utilisateur #12

```

Si les colonnes ne sont pas définies, la méthode retourne toutes les données.

### `getAll`, récupérer tous les enregistrement voulus dans une table {#get_all_values}

Syntaxe :

```javascript

DB.getAll(table[, filtre])

```

Par exemple :

```javascript

var resultats = await DB.getAll('icare_users.users')

```

retourne tous les users de la table `users` de la base de données `icare_users`.

Le `filtre` est une méthode qu'on va appliquer au résultat :

```javascript

return resultats.filter(filtre)

```

Par exemple :

```javascript

var resultats = await DB.getAll('icare_users.users', (rec) => { rec.options.substr(0,1) > 0})

```

### `update`, actualiser des données {#update_data_in_db}

Pour actualiser des données dans la base de données, à l'aide de l'identifiant et de la table.

```javascript

DB.update(table, id, {col:value, col:value, ...})

```

Par exemple :

```javascript

DB.update('icare_modules', 9, {titre: "Le nouveau titre du module #9"})

```

---------------------------------------------------------------------

## Les fichiers et dossiers {#folders_and_files}

### Travailler sur un fichier en le verrouillant {#lock_working_file}

Lorsque l'on doit travailler sur un fichier en le verrouillant — si, par exemple, il peut être modifié par deux sources — alors on peut utiliser la méthode pratique `File.execWithLock(path,function)` qui reçoit en premier ingrédient le chemin d'accès complet au fichier et en second argument le traitement qu'il faut appliquer.

Deux méthodes très pratiques permettent de lire et d'écrire dans le fichier sans avoir à charger le package `fs`, les méthodes `write` et `read`. Il suffit :

* de définir la méthode par `function(){...}` (et non pas `()=>{}`)
* de les appeler avec `this` (qui correspond alors à la méthode `execWithLock`).

Par exemple :

```javascript

File.execWithLock('path/to/mon/fichier', function(){
  var contenu = this.read() // lit le contenu du fichier 'path/to/mon/fichier'
  contenu += "J'ajoute du contenu."
  this.write(contenu)
})

```

Pendant toute cette opération, on ne pourra pas toucher au fichier. Si elle est exécutée en moins de 6 secondes, la procédure suivante qui doit modifier le fichier ensuite exécuté sur le fichier.

> Noter que s'il s'agit d'un fichier JSON par exemple, il est plus pratique d'utiliser `contenu = require(fpath)` qui convertira automatiquement le contenu en valeur javascript.


---------------------------------------------------------------------

## Les formulaires {#les_formulaires}

Les formulaires se codent de la manière suivante (code `pug`) :

```javascript

- vdt = locals.validator // si on a validé

form(id="form-Id" enctype="multipart/form-data" ...)

  input(type="hidden" name="token" value=`${token}`)

  div.row(id="div-row-property" class=vdt&&vdt.getClass('property'))

    // Le label (avec écriture du message d'erreur sur le champ)
    label "Label de la propriété"
      span.warning.tiny= vdt && vdt.getError('property')

    // Le champ de saisie
    input(
      type="text"
      name="property"
      value=vdt&&vdt.getValue('property')
    )

    // Le champ de saisie pour une confirmation, si nécessaire
    label "Confirmation de la propriété"
      span.warning.tiny= vdt && vdt.getError('property_confirmation')
    input(
      type="text"
      name="property_confirmation"
      value=vdt&&vdt.getValue('property_confirmation')
    )



  div.buttons

    span.fleft
      a(href="/back") Renoncer

    input(type="submit" value="Soumettre le formulaire")

```

Pour la validation des formulaires, cf. [ci-dessous](#valider_les_formulaires).


### Validation des formulaires {#valider_les_formulaires}

La première chose à penser est de mettre un token pour reconnaitre le formulaire :

Dans le router (ou app.js) :

```javascript
const uuidv4 = require('uuid/v4')

get('/monform', function(req,res){
  var token = uuidv4()
  req.session.form_token = token
  res.render('gabarit'), {place:'where', token:token}
})

```

Ensuite, dans la route `POST` qui reçoit la soumission du formulaire, on doit trouver :

```javascript

.post('/monform', function(req,res){
  FrontTests.checkFields(req) // seulement pour les tests des fichiers
  const MaValidation = require('./controller/MaValidation')
  if ( await MaValidation.isValid(req,res) ){
    res.render ...
  } else {
    Dialog.error(req.flash('error'))
    res.render ... /* ramener au formulaire */
  }
})

```

`MaValidation` est un objet qui doit permettre de tester la validité du formulaire. Elle peut se coder de cette manière :

```javascript

// On requiert d'abord le validateur qui va permettre d'utiliser
// des méthodes pratiques
const Validator = require('../Validator')

class MaValidation {

  // Méthode générale qui va retourner true si les données du formulaire
  // sont valides et faux dans le cas contraire.
  static async /* toujours, par prudence */ isValid(req, res)

  // On crée un validateur général qui permettra de n'avoir qu'une instance
  // de résultat avec tout ce qu'il faut, les messages d'erreurs, les propriétés
  // erronées, etc.
  let validator = new Validator(req, res)

  // On lance la validation en fournissant les propriétés à tester.
  // Chaque propriété doit correspondre au `name` d'un champ du formulaire.
  // ATTENTION : on met toujours en première valeur 'token' pour vérifier le
  // token du formulaire et empêcher les attaques.
  await validator.validate(['token', 'property1', 'prop2' /* etc. */])

  // Si on a rencontré des problèmes, on s'arrête tout de suite et on
  // renvoie false
  if ( validator.hasErrors() ) {
    req.flash('error', `Ce formulaire est invalide pour les raisons suivantes : ${validator.humanErrorList}`)
    res.locals.validator = validator  // pour montrer les champs erronés
                                      // et réaffecter les valeurs correctes
                                      // ou affecter de nouvelles valeurs.
    return false // pour s'arrête là
  }

  // Sinon, on continue en faisant ce qu'il faut faire
  // Sauf le chargement de la page suivante, qui se fera au retour
  /*  
      Ici du travail à faire sur le formulaire.
   */

  // On n'oublie pas de retourner true, sinon on penserait à une erreur
  // de validation
  return true
}
```

### Validateurs propres à l'application {#custom_form_validators}

Parmi les propriétés à valider, certaines sont communes : `token`, `mail` pour tester un mail et sa confirmation, `pseudo` pour tester un pseudo, `password` pour tester un mot de passe et sa confirmation.

Pour les propriétés propres des formulaires, il faut créer des classes héritant de la class `PropValidator` et définir à quelles propriétés elle doivent réagir.

Pour l'exemple, imaginons que nous devions valider deux propriétés : la première est `experience` (un champ pour écrire son expérience) et la seconde est `cv` (un document).

Dans le dossier `config/`, nous allons commencer par définir un fichier qui va contenir la définition de nos validations et que nous appellerons le [« fichier App Validator »](#fichier_validator_app). Dans `config/validator_tables.js`. Dans ce fichier, nous commençons par mettre :

```javascript

Object.assign(Validator.prototype, {
  validatorOfAppProperty(property){
    switch(property){
      case 'experience' : return new ExpeValidator(this)
      case 'cv':          return new CvValidator(this)
      /* mettre ici les autres propriétés dont nous avons besoin */
      default:
        throw new Error(`Impossible de trouver un validateur pour la propriété "${property}"`)
    }
  }
})

```

Nous définissons en dessous nos validateurs. Noter que les noms `ExpeValidator` et `CvValidator` peuvent être choisis à sa convenance.

```javascript

class ExpeValidator extends PropValidator {
  constructor(validator){super(validator, 'experience')}
  get human_name(){return 'Votre expérience'}
  get conditions(){return [
      ['isNotEmpty']
    , ['isGreaterThan', 99]   // doit faire 100 signes au moins
    , ['isShorterThan', 3001] // pas plus de 3000 signes
  ]}
}

class CvValidator extends PropValidator {
  constructor(validator){super(validator, 'cv')}
  get human_name(){return 'Votre CV'}
  get conditions(){return [
      ['isRequired'] // le fichier CV est absolument requis
    , ['MaCustomMethodeDeCheck']
  ]}
}

```

Les `conditions` ci-dessus sont, comme leur nom l'indique, les conditions que doit remplir une propriété pour être valide. On trouve ci-dessous la [Liste complète des conditions](#validator_all_conditions). Pour créer une nouvelle condition, on envoie son nom et la méthode de traitement comme c'est le cas ci-dessus avec la condition `MaCustomMethodeDeCheck`.

On définit cette méthode de cette façon :

```javascript

PropValidator.prototype.MaCustomMethodeDeCheck = function(params){
  let ce_test_est_false = /* tests à faire sur this.value */
  if (ce_test_est_false){
    return this.addError(params, `${this.human_name} devrait remplir le test ...`)
  }
}

// ou :
// Object.assign(PropValidator.prototype,{
//   MaCustomMethodeDeCheck(){
//    ...
//   }
// })

```

### Validation d’un fichier {#validate_a_file}

La validation d’un fichier est une opération spéciale. Il faut d'abord considérer que le traitement des formulaire `multipart/form-data` requièrent un traitement particulier, exécuté ici par le package `multer`. La route est définie par :

```javascript

post('/recevoir', upload.any(), async function(req, res){
  //  Ici, req.files est un Array qui contient tous les fichiers
  // donnés dans le formulaire.

  FrontTests.checkFields(req) // permet d'exécuter les tests en simulant
                              // l'entrée de documents

  // On peut charger un validateur qui va permettre d'isoler le traitement
  // de la validation.
  const MonValidateur = require('./controllers/monValidateur')

  if (await MonValidateur.validate(req, res)) {
    // Le formulaire a été validé
  } else {
    // Le formulaire n'a pas été validé, il faut le soumettre
    // à nouveau à l'utilisateur
  }
})

```

Ensuite, c'est dans `./controllers/monValidateur.js` que tout va se jouer. D'abord, en haut du fichier, on va appeler la configuration du grand validateur général `Validator`, avec :

```javascript

const Validator = require('../config/validator')

```

Ce chargement charge la classe générale, mais également toutes les définitions propres à l'application courante. Et notamment `Validator.prototype.validatorOfAppProperty` qui permet de définir des traitements sur des propriétés propres. Les documents sont des propriétés propres.

Imaginons un document dont la propriété s'appelle `presentation` (c'est la présentation de l'utilisateur, par exemple). On peut la définir de cette manière :

```javascript

Validator.prototype.validatorOfAppProperty = function(property) {
  let fval
  switch (property) {
    // ... des cas
    case 'presentation':
      fval = new FileValidator(this, 'presentation')
      // On définit le nom human du document, qui apparaitra dans les messages
      // de validation ou d'erreur
      fval.human_name = 'le document « Présentation de l’user »'
      // Ensuite, on définit comment le document doit être validé par
      // la méthode de validation `isValidFile`
      fval.isValidFile.data = {
        // Le document doit avoir une de ces extensions :
          extensions: ['.jpg', '.png', '.mp4']
        // Le document doit avoir une taille supérieure à ce nombre d'octets
        , min_size: 2000
        // Le document doit avoir une taille inférieure ou égale à ce nombre
        // d'octets
        , max_size: 100000
      }
      // On doit retourner cette instance de validateur
      return fval
  }
}

```

À présent, nous sommes prêts pour implémenter notre champ de formulaire pour recevoir le fichier de présentation de l'user :

```javascript

form(id="monForm")
  div.row(class=vdt&&vdt.getClass('presentation'))
    label Votre fichier de présentation
      span.warning.tiny= vdt && vdt.getError('presentation')
    //- Pour mettre le nom du document quand il est OK
    if vdt&&vdt.isNotErrorField('presentation')
      span= vdt.getFileName('presentation')
    //- input-file ou input-hidden suivant que le document a été
    //- donné ou non
    input(
      type=(vdt&&vdt.isNotErrorField('presentation'))?'hidden':'file'
      name="presentation"
      id="presentation"
      value=vdt&&vdt.getValueAsFile('presentation')
    )

```

### Fichier App Validator {#fichier_validator_app}

C'est un fichier qui peut se trouver dans le dossier des configuration de l'application, par exemple à l'adresse `<app folder>/config/validator.js`.

Il permet entre autres choses de [définir les validations](#custom_form_validators) propres au site ou [définir les tables DB](#define_db_tables).

### Définir les tables DB de validation {#define_db_tables}

Certaines méthodes, en particulier `isUniq`, ont besoin de savoir quelle table utilisée pour effectuer leur test. On le définit en étendant la classe `Validator` avec la propriété `tablePerProperty`. Cette extension peut se faire dans le [fichier App Validator](#fichier_validator_app).

```javascript

// Pour tablePerProperty
module.exports = {
    'mail': ['icare_users.users', 'mail']
  , 'pseudo': ['icare_users.users', 'pseudo']
}

```

En clé se trouve la propriété utilisée dans le formulaire (en général, c'est le nom de la colonne dans la table). En valeur, on définit un Array qui contient en premier élément la table à utiliser, sous la forme `database.table` et en second élément le nom de la colonne qui contient la valeur.


### Liste complète des conditions {#validator_all_conditions}

`isRequired`
: Produit un échec si l'élément n'est pas fourni.

`isNotEmpty`
: Produit une erreur si le champ est vide.

`isEqual(expected)`
: Produit une erreur si le champ ne vaut pas cette valeur. Par exemple pour tester la confirmation d'une donnée.

`isMatching(regExp)`
: Produit une erreur si la valeur du champ ne matche pas l'expression régulière fournie en argument.

`isConfirmed`
: Produit une erreur si la confirmation de la valeur ne correspond pas à la valeur (comme c'est la nécessité pour le mail ou le mot de passe à l'inscription).
: Pour pouvoir fonctionner, le champ de saisie de la confirmation doit impérativement porter le même nom que la propriété, auquel on ajoute `_confirmation`. Par exemple, si le champ du mail s'appelle `mail` (`name="mail"`), il est impératif que le champ de saisie de la confirmation porte le `name="mail_confirmation"`. Dans le cas contraire, la confirmation ne pourrait être testée.

`isGreaterThan(expected)`
: Produit une erreur si la valeur du champ est moins long que la valeur donnée en argument (expected).

`isShorterThan(expecter)`
: Produit une erreur si la valeur du champ est plus long que la valeur donnée en argument (expected).

`isUniq(property)` `['isUniq', 'property']`
: Produit une erreur si la valeur du champ ne contient pas une valeur unique pour la colonne `property` dans la table `table`.
: Cette méthode a besoin de [définir les tables DB de validation](#define_db_tables)

`isValidFile(hexpected)`
: Produit une erreur si le document correspondant à la propriété courante ne respecte pas les données définies dans `hexpected` (ou définies dans `isValidFile.data`).
: Cf. [Validation d’un fichier](#validate_a_file) pour le détail.

---------------------------------------------------------------------

## Mails {#les_mails}

### Envoyer un mail {#send_a_mail}

Utiliser la méthode :

```javascript

Mail.send({
    to: 'destinataire' // ou l'atelier
  , from: 'expéditeur' // ou l'atelier
  , subject: "Le sujet" // avec ou non l'entête du site
  , text: "le texte" // le message textuel
  , html: "code html" // le code HTML ou le texte htmlisé
  , force_local: false // mettre true pour forcer l'envoi même en local
})

```

### Configuration des mails {#mail_configuration}

Les mails se configurent dans le fichier `./config/mail.js`. Attention, il ne s'agit pas des [données de connexion](#mail_connexion_data) mais des configurations.

ce fichier de configuration peut définir :

```js

'use strict'

module.exports = {
    name: 'Fichier de configuration de Mail'
  // Entête pour les sujets de mail
  , subject_header: "[ICARE] "
  // Pour savoir si on utilise les mails en local ou non La méthode à appeler
  // doit retourner `true` si l'utilisation du site est locale, `false` dans
  // le cas contraire
  , checkIfLocal: function(){ return Site.isLocalSite }
  // Mettre à `true` pour envoyer les mails même en local (localhost)
  , sendEvenLocal: false
  // Le path du dossier temporaire (où, notamment, doivent être enregistrés
  // les mails quand ils ne sont pas envoyés). Indispensable pour les tests.
  , folderTmp: function(){return Site.folderMails}
  // La méthode à utiliser pour obtenir l'entête du mail
  , header: function(){return MailSite.header()}
  // OU le code à utiliser :
  // , header: function(){return '<section id="header"></section>'}
  // La méthode à utiliser pour obtenir le pied de page des mails
  , footer: function(){return MailSite.footer()}
  // La feuille de style à utiliser
  , css: function(){return MailSite.css() }
}


```

### Données de transmission {#mail_connexion_data}

Les données de `host`, de `user` etc. à utiliser pour transmettre des mails doivent être définis dans le fichier `./private/secret/mail.json` qui doit définir :

```json
{
  "host": "hote.net",
  "port": 587,
  "secure": false,
  "auth": {
    "user": "utilisateur",
    "pass": "mot de passe"
  },
  "logger": true
}


```

---------------------------------------------------------------------

## Les Tickets {#les_tickets}

### Présentation des tickets {#presentation_des_tickets}

Les tickets permettent d'exécuter des opérations depuis l'extérieur du site. L'exemple type est la validation du mail, sa confirmation : l'utilisateur reçoit un mail contient un lien à cliquer pour confirmer son mail. Il le clique, cela appelle une adresse de type `http://monsite.net/tck/23GFH5DD4` qui joue le ticket d'identifiant `23GFH5DD4` qui lui permet de confirmer l'email.

### Créer un ticket {#creer_un_ticket}

Pour créer un ticket, il faut comprendre que celui-ci peut être constitué de deux manières différentes :

* avec un *code brut* à évaluer. Si, par exemple, on voulait que le ticket ne fasse qu'afficher le message « Vous êtes revenu ! », il suffit de lui donner le code `Dialog.annonce("Vous êtes revenu !")`.
* avec un *hash de données* qui permet des opérations plus complexes.

Quelle que soit la forme du ticket, il sera créé avec :

```javascript

const Ticket = System.require('controllers/Ticket')
let ticket = Ticket.create(codeOuData)

```

On peut se servir ensuite de l'identifiant du ticket, `ticket.id` ou des helpers de méthode, comme par exemple `ticket.link(...)` pour l'insérer dans un mail.

#### Création à partir d'un code brut

Il suffit d'envoyer le code brut à la méthode de création :

```javascript

const Ticket = System.require('controllers/Ticket')
let code   = `fais ceci ou fais cela`
let ticket = Ticket.create(code)

let lien_mail = ticket.link("Jouer le ticket")

```

#### Création à partir d'un hash de données

Pour créer un ticket avec un hash de données, il faut impérativement que cette table contiennent la propriété `code` qui doit être une **fonction existante**. Il faut **impérativement** que ce soit une fonction.

* Cette fonction — *méthode de traitement* — recevra les données de ce ticket en premier argument.
* Elle doit impérativement retourner `true` en cas de succès d'opération et `false` dans le cas contraire (le ticket ne sera pas détruit).

Pour requérir un module avant d'appeler la méthode, on définit la propriété `required` dont la valeur est un chemin relatif utilisable par `System.require`. Par exemple `controllers/User`. **Cet objet requis sera mis dans la variable `Required`** qui sera utilisé pour trouver la *méthode de traitement*.


```javascript

{
    required:'controllers/MonController'  // MonController mis dans `Required`
  , method: 'fonctionAJouer'       // <= Required.fonctionAJouer sera invoquée
}

```

On peut également, par ce biais, définir une date d'expiration avec la propriété `expireAt`.

Toutes les autres propriétés dépendent de ce dont a besoin la méthode de traitement.

Voyons par exemple le ticket qui permet de confirmer un mail :

```javascript

const Ticket = System.require('controller/Ticket')
let dataTicket = {
    required: 'controllers/user/signup' // Mets Signup dans Required
  , method:   'confirmMail'             // appelle la méthode 'confirmMail' de
                                        // Required donc de Signup, that's it!
  , expireAt: Number(new Date()) + 10 * 3600 // expire dans 10 heures
  , user_mail: uData.mail         // défini plus haut dans le code
  , candidate_id: id_candidature  // idem
}
let ticket = Ticket.create(dataTicket)

let lienMail = ticket.link(`confirmer votre mail ${uData.mail}`)

```

La méthode `confirmMail` définie dans le module `controllers/user/signup` (qui gère toutes l'inscription d'un icarien), recevra en premier argument les données envoyées (`dataTicket`), et pourra donc retrouver les données de candidature grâce à `candidate_id` et vérifier qu'il s'agit du bon candidat grâce à `user_mail` (si une confirmation est demandée à l'utilisateur).

### Obtenir le lien du ticket {#get_ticket_link}

Pour obtenir un lien à copier dans un mail, on utiliser la méthode `link` du ticket en lui transmettant le titre à utiliser :

```javascript

var ticket = Ticket.create(...)

var lien = ticket.link("Jouer le ticket")

```

On peut transmettre en second argument des attributs qui seront ajoutés au mail.

```javascript

var lien = ticket.link("Jouer le ticket", {class:'maClasse', 'data-date-emit': Number(new Date())})

```

---------------------------------------------------------------------

## Les Actualités {#les_news}

```javascript

News.create(user_id, message, status)

```

### Statuts des actualités

```

  -----------------------------------
  | status  | Home  | Mail  | Mail  |
  |         | page  | quoti | hebdo |
  -----------------------------------
  |    0    |   -   |   -   |   -   |
  |    1    |   x   |   -   |   -   |
  |    2    |   x   |   x   |   -   |
  |    3    |   x   |   x   |   x   |
  -----------------------------------

```

0
: Une actualité qui ne doit être ni annoncée par mail ni placée sur la page d'accueil

1
: Une actualité placée sur la page d'accueil mais pas annoncée par mail.

2
: Une actualité placée sur la page d'accueil et envoyé seulement par le mail quotidien.

3
: Actualité placée sur la page d'ccueil
