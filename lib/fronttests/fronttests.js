// Essai de module qui importe les modules
import('./lib/required.js').then((module)=>{
  const Required = module.Required;
})



/*
  @method action(str)
  @description Pour écrire une action +str+ à faire dans la console.
  @provided
    :str {String} L'action accomplie.
  @usage action("Je vais remplir le formulaire avec de bonnes valeurs.")
 */
function action(str){
  Log.blue(`👩‍💼 ${str}`)
}
/*
  @method constraint(str)
  @description Pour écrire une contrainte dans le suivi du test
  @provided
    :str {String} La contrainte attendue
  @usage constraint("Le document doit être ouvert.")
 */
function constraint(str){
  Log.orange(`🔸 ${str} (lig.${lineNumber(3)})`)
}



/**
  Méthode appelée par le bouton "LANCER TOUS"
**/
function RunAllTest(){
  var runner = new FrontTestsRunner()
  runner.RunAllFrontTestsFiles()
}
/**
  Méthode appelée par le bouton "LANCER"
**/
function RunTheTest(){
  var runner = new FrontTestsRunner()
  runner.RunFrontTestsFile()
}
/**
  Méthode appelée par le bouton "Jouer le code" qui lance
  le code du bac à sable
**/
function RunLiveCode(){
  var runner = new FrontTestsRunner()
  runner.FrontTestsRunLiveCode()
}

class FrontTestsRunner {
  /**
    Fonction principale de lancement des tests
    Pour le moment, il faut la programmer en dur car on ne peut ni requérir ni
    établir la liste des fichiers tests. Ce serait possible de le faire en
    chargeant la page totale, avec node.js.
  **/
  async RunAllFrontTestsFiles(){
    FrontTests.reset()
    FrontTests.init()
    for ( var testfile of FrontTests.config.wishList ) {
      console.log("[FrontTestsRunner] -> ", testfile)
      await this.runThisTestFile(testfile)
    }
    Log.stop()
    this.rapportFinal()
  }

  /**
    Fonction de lancement du test désigné par son chemin relatif dans le champ
    de saisie ou le premier fichier de la wishList des configurations.
    Ce chemin relatif, on le cherche, dans l'ordre :
      - dans le champ de saisie de l'interface
      - dans la "wishList" des configurations
      - dans la liste totale des tests (à voir)
  **/
  async RunFrontTestsFile(){
    const my = this
    FrontTests.reset()
    FrontTests.init()
    var relpath = document.querySelector('#fronttests-test-filename').value.trim()
    if ( !relpath || relpath === '') {
      if ( FrontTests.config.wishList ){
        relpath = FrontTests.config.wishList[0]
      }
    }
    relpath || raise("Il faut indiquer le chemin du test.")
    await this.runThisTestFile(relpath)
    Log.stop()
    this.rapportFinal()
  }

  /**
    Méthode appelée pour jouer le test +relpath+ de façon asynchrone, donc pour
    une utilisation dans une boucle avec `await runThisTestFile(...)`
  **/
  runThisTestFile(relpath){
    return new Promise((ok,ko)=>{
      // On indique toujours le chemin relatif du test dans le champ
      // Surtout utile lorsque l'on joue une suite de tests
      document.querySelector('#fronttests-test-filename').value = relpath
      import(`./__app_tests__/${relpath}`).then(async mod => {
        mod || raise(`Impossible de trouver le fichier "../../tests/${relpath}"`)
        // console.log("mod=", mod)
        var fn_name = Object.keys(mod)[0]

        Log.reset()
        Log.start()
        try {
          await mod[fn_name].call() // on joue le test
        } catch (e) {
          Log.error(e.message)
          console.error(e)
        } finally {
          // On passe toujours à la suite
          ok()
        }
      })
    })
  }

  /**
    Méthode qui joue le code placé dans le champ de texte pour
    l'évaluer comme un test.
    C'est cette méthode qui répond au bouton "Jouer le code"
  **/
  async FrontTestsRunLiveCode(){
    const my = this
    try {
      FrontTests.reset().init()
      let code = document.querySelector('#codetest').value
      // On entoure le code dans une fonction asynchrone
      code = `async function __FrontTestsCodeFunction(){${code}};__FrontTestsCodeFunction()`
      Log.reset()
      Log.start()
      await eval(code)
      Log.stop()
    } catch (e) {
      failure(`Une erreur est survenue : ${e}`)
      console.error(e)
    } finally {
      my.rapportFinal()
    }
  }

  /**
    Méthode construisant le rapport final du test
  **/
  rapportFinal(){
    var color = (()=>{
      if ( FrontTests.failure_count ) return "#E90000" // rouge
      else if ( FrontTests.pending_count ) return "orange"
      else return "#00DD00" // "#79EAAC" // vert
    })()
    var s_echec = FrontTests.failure_count > 1 ? 's' : ''
    var msg = `${FrontTests.success_count} succès - ${FrontTests.failure_count} échec${s_echec} - ${FrontTests.pending_count} en attente`
    Log.add("\n\n")
    Log.add(msg, null, `color:${color};font-weight:bold;`)
    Log.add(`Durée : ${Log.duree} secs`, 'mini')
  }
}




// ---------------------------------------------------------------------
//  Méthodes d'écriture

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
function pending(msg){
  FrontTests.pending_count ++
  Log.updatePendingCount(FrontTests.pending_count)
  Log.pending(msg)
}

/**
  Pour ouvrir/fermer le bac à sable pour essayer du code
**/
function FrontTestsToggleSandbox(){
  // let sandbox
  if ( undefined === this.sandboxOpened ){
    this.sandboxOpened = false
    this.sandbox = document.querySelector('#escamotable-sandbox')
  }
  this.sandboxOpened = !this.sandboxOpened
  this.sandbox.style.display = this.sandboxOpened ? 'block' : 'none'

}
