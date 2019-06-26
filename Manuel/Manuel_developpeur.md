# Manuel de développement de l'atelier Icare en version Node.js/Express

* [Bases de données](#les_bases_de_données)
  * [`get`, obtenir une des valeurs (colonnes) avec l'identifiant](#get_values_with_id})

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


### `update`, actualiser des données {#update_data_in_db}

Pour actualiser des données dans la base de données, à l'aide de l'identifiant et de la table.

```javascript

DB.update(table, id, {col:value, col:value, ...})

```

Par exemple :

```javascript

DB.update('icare_modules', 9, {titre: "Le nouveau titre du module #9"})

```
