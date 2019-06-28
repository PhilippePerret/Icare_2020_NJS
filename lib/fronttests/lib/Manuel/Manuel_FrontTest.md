# Manuel d'utilisation des tests FrontTests


L'originalité de ces tests tient au fait qu'il se font à côté du site testé, comme si on était un utilisateur en train de se servir du site.

## Installation de FrontTests pour un site

2 fichiers et 2 dossier sont indispensables :

* Le dossier `js/FrontTests` qui doit être placé dans le dossier `js` public du site (et pas ailleurs, pas en dehors de l'application).
* Le dossier `js/__ftests__` qui va contenir tous les tests et doit lui aussi être placé dans le dossier `js` public du site.
* Le fichier `js/fronttests.js` qui est le fichier principal dont tout part.
* Le fichier `pages/fronttests.pug` (ou autre format) qui est la vue qu'on chargera dans l'iframe permettant de commander le site.

Ensuite, dans l'application, il faut ajouter, dans le fichier `app.js` (ou autre, mais la racine du site) :

```javascript
// app.js

// Un middleware qui activera les fronttest si le paramètre
// fronttests=1 est trouvé
app.use((req,res,done)=>{
  global.fronttests = req.query.fronttests == '1'
  done()
})


app
//...
  .get('/tests',()=>{
    res.render('frontests') // doit charger `pages/fronttests.pug`
  })

```

Et dans le gabarit principal, on doit faire :

```javascript

//- fronttests sera défini plus tard
if fronttests
  iframe(id="monSite",src="http://localhost:3000",width="60%",height="700")
  iframe(id="monTest",src="http://localhost:3000/tests",width="38%",height="700")
else
  doctype html
  html
    include includes/layout/head
    body


```
