# Manuel de développement de l'atelier Icare en version Node.js/Express

* [Utilisateurs/Icariens](#les_utilisateurs)
  * [Tester si l'user courant est admin](#test_if_user_current_admin)
  * [Tester si l'user courant est icarien](#tests_if_current_icarien)
* [Contenu textuel](#contenu_textuel)
  * [Insérer du code HTML dans la page](#insert_html_code_in_page)
* [Bases de données](#les_bases_de_données)
  * [`get`, obtenir une des valeurs (colonnes) avec l'identifiant](#get_values_with_id})
  * [`getAll`, récupérer tous les enregistrement voulus dans une table](#get_all_values)
  * [`update`, actualiser des données](#update_data_in_db)
* [Les formulaires](#les_formulaires)
  * [Validation des formulaires](#valider_les_formulaires)


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

## Les formulaires {#les_formulaires}

Les formulaires se codent de la manière suivante (code `pug`) :

```javascript

- vdt = locals.validator // si on a validé

form(id="form-Id" enctype="multipart/form-data" ...)

  input(type="hidden" name="token" value=`${token}`)

  div.row(id="div-row-property" class=vdt&&vdt.getClass('property'))

    // Le label
    label "Label de la propriété"

    // Le champ de saisi
    input(
      type="text"
      name="property"
      value=vdt&&vdt.getValue('property')
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

Parmi les propriétés à valider, certaines sont communes : `token`, `mail` pour tester un mail et sa confirmation, `pseudo` pour tester un pseudo, `password` pour tester un mot de passe et sa confirmation.

Pour les propriétés propres des formulaires, il faut créer des classes héritant de la class `PropValidator` et définir à quelles propriétés elle doivent réagir.

Pour l'exemple, imaginons que nous devions valider deux propriétés : la première est `experience` (un champ pour écrire son expérience) et la seconde est `cv` (un document).

Dans le dossier `support/app`, nous allons commencer par définir un fichier qui va contenir la définition de nos validations. Par exemple dans `support/app/validations.js`. Dans ce fichier, nous commençons par mettre :

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


### Liste complète des conditions {#validator_all_conditions}

`isRequired` (fichiers)
: Produit un échec si le fichier n'est pas fourni.

`isNotEmpty`
: Produit une erreur si le champ est vide.

`isEqual(expected)`
: Produit une erreur si le champ ne vaut pas cette valeur. Par exemple pour tester la confirmation d'une donnée.

`isMatching(regExp)`
: Produit une erreur si la valeur du champ ne matche pas l'expression régulière fournie en argument.

`isGreaterThan(expected)`
: Produit une erreur si la valeur du champ est moins long que la valeur donnée en argument (expected).

`isShorterThan(expecter)`
: Produit une erreur si la valeur du champ est plus long que la valeur donnée en argument (expected).

`isUniq(table, property)`, `['isUniq', '<property>']`
: Produit une erreur si la valeur du champ ne contient pas une valeur unique pour la colonne `property` dans la table `table`.
