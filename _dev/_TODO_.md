# Todo list

Pour le moment, essayer de charger des tests dans la page quand `MODE_TEST` et commander les pages comme une application
  note : on utilise 'window.location = "/u/r/l"' pour se rendre quelque part.
  Non : on ne peut pas utiliser ce système car la page est rechargée chaque fois, justement, ou alors, on fait un truc qui teste la page en question. genre :

  s'il n'y a aucune page spéciale
    on lance le test
    par exemple 'window.location = '/signup'

  si la location est '/signup'
    si le formulaire est vide
      
