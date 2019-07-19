const WITH_CLUSTER = false

let cluster
if ( WITH_CLUSTER ) cluster = require('cluster')


if ( WITH_CLUSTER && cluster.isMaster ) {
  // Code à jouer si on est dans le cluster maitre

  // Count the machine's CPUs
  var cpuCount = require('os').cpus().length
  console.log("Nombre de CPU : %d", cpuCount)

  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
      cluster.fork();
  }

  // Listen for dying workers
  cluster.on('exit', function (worker) {
      // Replace the dead worker
      console.log('Le Worker #%d est décédé :(', worker.id)
      cluster.fork()
      console.log('Je l’ai ressuscité')
  })

} else {
  // Si on n'est pas dans le cluster maitre ou si l'on n'utilise pas de
  // cluster

  WITH_CLUSTER && ( global.worker = cluster.worker )


  const express = require('express')
  const app = express()
  const bodyParser = require('body-parser')
  const cookieParser = require('cookie-parser')
  const uuidv4       = require('uuid/v4')

  // Pour l'upload de fichier
  const multer = require('multer')
  // const upload = multer({ storage: multer.memoryStorage() })
  const upload = multer({ dest: 'uploads/' })

  const session = require('express-session')

  global.glob = require('glob')

  // Mes objets et middlewares
  global.DB = require('./config/mysql') // DB.connexion

  global.APP_PATH = __dirname
  global.System = require('./Controllers/System')
  global.Sys = System // raccourci
  System.require('controllers/Date') // extension
  global.App    = Sys.reqController('App')
  global.Icare  = Sys.require('controllers/Icare')
  global.User   = Sys.reqModel('User')

  // Usings
  // Pour les sessions
  app.use(session({
    secret: 'ATELIERICARE',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
  }))

  // Gestion complète des messages
  global.Dialog = Sys.reqController('Dialog')// instance Dialog
  Dialog.session = session

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))
  // parse application/json
  app.use(bodyParser.json())

  // J'essaie ça pour pouvoir récupérer les valeurs postées dans le middleware
  // de FrontTests
  app.use(express.urlencoded({ extended: false }))

  app.use(cookieParser('ATELIERICARECOOKIES'))

  // Pour définir la route des css, js et autres imagines
  app.use('/assets', express.static(__dirname + '/lib'))

  // Engin de rendu de vue
  app.set('views', './_pages')
  app.set('view engine', 'pug')

  global.PUG = require('pug')

  // Middleware
  // Reconnecter l'auteur qui s'est identifié (if any)
  app.use(User.reconnect)

  app.use((req,res,next) => {
    // res.locals.request = req
    Icare.isLocalSite = req.headers.host.split(':')[0] === 'localhost'
    App.online  = !Icare.isLocalSite
    App.offline = Icare.isLocalSite

    // On renseign `req` dans les locals ce qui permettra à toutes
    // les vues de disposer de la requête, utile par exemple pour
    // req.user
    res.locals.req = res.locals.request = req

    // On renseigne `route` qui pourra être utilisé n'importe où
    // dans les vues et templates
    res.locals.route = req.path

    // On continue
    next()
  })

  global.FrontTests = require('./lib/fronttests/app_middleware')
  app.use('/ftt(/:action)?', FrontTests.run)
  app.get('/fttajax', FrontTests.ajax.bind(FrontTests))

  // === ROUTERS ===
  app.use('/bureau',        Sys.reqRouter('bureau'))
  app.use('/signup',        Sys.reqRouter('signup'))
  app.use('/admin/modules', Sys.reqRouter('admin/modules'))
  app.use('/admin',         Sys.reqRouter('admin'))
  app.use('/paiement',      Sys.reqRouter('paypal'))
  app.use('/auth',          Sys.reqRouter('authentification'))

  // Router pour l'inscription

  app.get('/', async function (req, res) {
    // Si on est en offline, on peut tester du code et imprimer le
    // résultat sur la page d'accueil
    let HTC = {resultat:''}
    if ( App.offline ) {
      HTC = Sys.reqController('HomeTestCode')
      await HTC.test()
    }
    res.render('home', {worker: WITH_CLUSTER ? cluster.worker : undefined, htc_resulat:HTC.resultat})
  })
  .get('/tck/:ticket_id', function(req,res){
    let Ticket = System.require('controllers/Ticket')
    var place = Ticket.traite(req.params.ticket_id)
    res.render('gabarit', { place: place || 'home' })
  })
  .get('/modules', async function(req, res){
    global.AbsModule = Sys.reqModel('AbsModule')
    await AbsModule.getAllModules()
    res.render('gabarit', {place: 'modules'})
  })
  .get('/absmodule/:module_id/:action', function(req,res){
    res.render('gabarit', {place:'modules', action:req.params.action, module_id:req.params.module_id})
  })
  .get('/aide(/:section)?', function(req,res){
    res.render('gabarit', {place:'aide', question:req.session.question, section:req.params.section})
    delete req.session.question
  })
  .post('/aide', function(req,res){
    req.session.question = req.body.user_question
    res.redirect('/aide/reponse')
  })
  .get('/fronttests', function(req,res){
    res.sendFile(__dirname+'/lib/fronttests/html/fronttests.html')
  })
  // .get('*', function(req,res){
  //   Dialog.error("Cette route est inconnue du site…")
  //   res.redirect('/')
  // })

  var server = app.listen(process.env.ALWAYSDATA_HTTPD_PORT||3000, process.env.ALWAYSDATA_HTTPD_IP, function () {
    console.log('Site Icare démarré !')
    // server.close(function() { console.log('Doh :('); });
  })
  .on('close', () => {
    console.log("Je quitte l'application.")
    DB.stop()
  })

  module.exports = server

}
