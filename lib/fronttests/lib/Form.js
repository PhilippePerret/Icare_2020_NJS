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
    this.domObj = wnd.document.querySelector(this.selector)
    this.domObj || raise(`Impossible de trouver le formulaire ${this.selector}…`)
  }

  /*
    @method Form#fillWith(valeurs)
    @description Remplit le formulaire avec les valeurs passées en argument.
    @provided
      :valeurs {Objet} La clé est une référence au champ (id, name) et la valeur est la valeur à donner à ce champ.
    @usage new Form('#monForm').fillWith({pseudo: "Pseudo", mail: "Son@mail.net"})
   */
  fillWith(values){
    for ( var k in values ){
      var value = values[k]
      var field = this.getElementFrom(k)
      // TODO Plus tard, il faudra faire des tests pour savoir si c'est
      // value ou autre qu'il faut utiliser (pour les checkboxes par exemple)
      field.value = value
    }
  }

  /**
    Pour soumettre le formulaire
  **/
  /*
    @method Form#submit()
    @description Pour soumettre le formulaire avec ses valeurs
    @usage await (new Form('#monForm')).submit()
   */
  async submit(){
    this.domObj.submit()
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
