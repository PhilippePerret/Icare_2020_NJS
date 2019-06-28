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
