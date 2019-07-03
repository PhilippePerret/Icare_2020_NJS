'use strict'

/**
  | Les méthodes utiles pour les formulaires
  |
  | let form = new Form("#idDuForm")
  | form.fillWith(objetData)
  |
**/
export class Form {
// ---------------------------------------------------------------------
//  CLASSE
static test(){
  console.log("Form chargé correctement.")
}

// ---------------------------------------------------------------------
//  INSTANCES

  constructor(selector, options){
    this.selector = selector
  }

  get domObj(){
    if ( !this._domobj ) {
      this._domobj = wnd.document.querySelector(this.selector)
      this._domobj || raise(`Impossible de trouver le formulaire ${this.selector}…`)
    }
    return this._domobj
  }
  set domObj(v){ this._domobj }

  /*
    @method Form#fillWith(valeurs)
    @description Remplit le formulaire avec les valeurs passées en argument.
    @provided
      :valeurs {Objet} La clé est une référence au champ (id, name) et la valeur est la valeur à donner à ce champ.
    @usage new Form('#monForm').fillWith({pseudo: "Pseudo", mail: "Son@mail.net"})
   */
  fillWith(values){
    delete this._domobj // [NOTE 0001]
    for ( var k in values ){
      var value = values[k]
      var field = this.getElementFrom(k)

      // TODO Plus tard, il faudra faire des tests pour savoir si c'est
      // value ou autre qu'il faut utiliser (pour les checkboxes par exemple)

      if ( field.tagName === 'INPUT' && field.type == 'file') {
        // console.log("Il s'agit d'un champ file")
        /**
          |
          | Pour le moment, je n'arrive pas à utiliser le input-file
          | dans les tests, après des heures de lecture de tous les exemples
          | je vais simuler quelque chose : remplacer le champ original par
          | un autre (cf. la méthode fakeAInputFile)
        **/
        this.fakeAInputFile(field, value)
      } else {
        field.value = value
      }
    }
  }

/**
  Ne sachant pas comment gérer les input-file dans les tests (pour simuler
  que l'utilisateur choisit un fichier)
**/
fakeAInputFile(field, filename){
  const fakedContainer = document.createElement('SPAN')
      , fakedField = document.createElement('INPUT')
      , fakedType  = document.createElement('INPUT')
      , fakedName  = document.createElement('SPAN')
  fakedField.type = 'hidden'
  fakedType.type = 'hidden'
  fakedField.name = field.name
  fakedType.name  = field.name
  fakedField.value = filename
  fakedName.innerHTML = filename
  fakedType.value   = 'faked-file-field'
  fakedContainer.append(fakedType)
  fakedContainer.append(fakedField)
  fakedContainer.append(fakedName)
  field.replaceWith(fakedContainer)
}

  /**
    Pour soumettre le formulaire
  **/
  /*
    @method Form#submit()
    @description Pour soumettre le formulaire avec ses valeurs. Ne pas oublier `await` pour que la méthode attende que la page suivante soit chargée.
    @usage await (new Form('#monForm')).submit()
   */
  async submit(){
    this.domObj.submit()
    await wait(100)
    await waitForPageReady()
  }
  /**
    retourne l'élément DOM correspondant à +ref+ qui peut être l'id,
    le name ou autre
  **/
  getElementFrom(ref){
    var hel
    if ( hel = this.domObj.querySelector(ref) ) return hel
    else if ( hel = this.domObj.querySelector(`*[name="${ref}"]`)) return hel
    else throw new Error(`Impossible de trouver le champ de formulaire à partir de "${ref}".`)
  }
}
