// Essai de module qui importe les modules
import('./FrontTests/required.js').then((module)=>{
  const Required = module.Required;
})


// ---------------------------------------------------------------------
//    MÉTHODES FONCTIONNELLES

/**
  Fonction principale de lance du test désigné par son chemin relatif
**/
function RunTestFile(){
  var relpath = document.querySelector('#test-filename').value.trim()
  relpath || raise("Il faut indiquer le chemin du test.")
  FrontTests.reset()
  import(`./__ftests__/${relpath}`).then(async mod => {
    mod || raise(`Impossible de trouver le fichier "../../tests/${relpath}"`)
    // console.log("mod=", mod)
    var fn_name = Object.keys(mod)[0]
    console.log("fn_name = ", fn_name)

    Log.reset()
    Log.start()
    try {
      await mod[fn_name].call() // on joue le test
    } catch (e) {
      Log.error(e.message)
      console.error(e)
    } finally {
      Log.stop()
      rapportFinal()
    }
  })
}
/**
  Fonction principale de lancement des tests
  Pour le moment, il faut la programmer en dur car on ne peut ni requérir ni
  établir la liste des fichiers tests. Ce serait possible de le faire en
  chargeant la page totale, avec node.js.
**/
function runTests(){
  FrontTests.reset()
  console.log("Je dois jouer les tests.")
}

/**
  Méthode principale qui joue le code placé dans le champ de texte pour
  l'évaluer comme un test.
  C'est cette méthode qui répond au bouton "Jouer le code"
**/
async function runCode(){
  try {
    FrontTests.reset()
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

// ---------------------------------------------------------------------
//  Méthodes d'écriture

function rapportFinal(){
  var color = (()=>{
    if ( FrontTests.failure_count ) return "#E90000" // rouge
    else if ( FrontTests.pending_count ) return "orange"
    else return "#00DD00" // "#79EAAC" // vert
  })()
  var s_echec = FrontTests.failure_count > 1 ? 's' : ''
  var msg = `${FrontTests.success_count} succès - ${FrontTests.failure_count} échec${s_echec} - ${FrontTests.pending_count} en attente`
  Log.add("\n\n")
  Log.add(msg, `color:${color};font-weight:bold;`)
  Log.add(`Durée : ${Log.duree} msecs`, 'mini')
}
function failure(msg){
  FrontTests.failure_count ++
  Log.updateFailureCount(FrontTests.failure_count)
  Log.failure(msg)
}
function success(msg){
  FrontTests.success_count ++
  Log.updateSuccessCount(FrontTests.success_count)
  Log.success(msg)
}
