// Essai de module qui importe les modules
import('./FrontTests/required.js').then((module)=>{
  const Required = module.Required;
})


// ---------------------------------------------------------------------
//    MÉTHODES FONCTIONNELLES


/**
  Fonction principale de lancement des tests
  Pour le moment, il faut la programmer en dur car on ne peut ni requérir ni
  établir la liste des fichiers tests. Ce serait possible de le faire en
  chargeant la page totale, avec node.js.
**/
function runTests(){
  console.log("Je dois jouer les tests.")
}

/**
  Méthode principale qui joue le code placé dans le champ de texte pour
  l'évaluer comme un test.
  C'est cette méthode qui répond au bouton "Jouer le code"
**/
async function runCode(){
  try {
    let code = document.querySelector('#codetest').value
    Log.reset()
    Log.start()
    await eval(code)
    Log.stop()
  } catch (e) {
    failure(`Une erreur est survenue : ${e}`)
    console.error(e)
  } finally {
    rapportFinal()
  }
}

let failure_count = 0
let success_count = 0
let pending_count = 0

// ---------------------------------------------------------------------
//  Méthodes d'écriture

function rapportFinal(){
  var color = (()=>{
    if ( failure_count ) return "#89FF8E" // rouge
    else if ( pending_count ) return "orange"
    else return "#00DD00" // "#79EAAC" // vert
  })()
  var msg = `${success_count} succès - ${failure_count} échecs - ${pending_count} en attente`
  Log.add("\n\n")
  Log.add(msg, `color:${color};font-weight:bold;`)
  Log.add(`Durée : ${Log.duree} msecs`, 'mini')
}
function failure(msg){
  failure_count ++
  Log.failure(msg)
}
function success(msg){
  success_count ++
  Log.success(msg)
}
