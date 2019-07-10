const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const uuidv4       = require('uuid/v4');

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
const Mail    = Sys.require('controllers/Mail')

// Usings
// Pour les sessions
app.use(session({
  secret: 'ATELIERICARE',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}))

global.Dialog = Sys.reqController('Dialog')
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

  // On renseigne `route` qui pourra être utilisé n'importe où
  // dans les vues et templates
  res.locals.route = req.path

  // On continue
  next()
})

global.FrontTests = require('./lib/fronttests/app_middleware')
app.use('/ftt(/:action)?', FrontTests.run)
app.get('/fttajax', FrontTests.ajax.bind(FrontTests))

// Router pour le bureau
app.use('/bureau',  Sys.reqRouter('bureau'))
app.use('/signup',  Sys.reqRouter('signup'))
app.use('/admin',   Sys.reqRouter('admin'))

// Router pour l'inscription

app.get('/', function (req, res) {
  res.render('gabarit', {place: 'home'})
})
.get('/tck/:ticket_id', function(req,res){
  let Ticket = System.require('controllers/Ticket')
  var place = Ticket.traite(req.params.ticket_id)
  res.render('gabarit', { place: place || 'home' })
})
.get('/login', function(req,res){
  if ( ! Dialog.message ) Dialog.action_required("Merci de vous identifier.")
  res.render('gabarit', {place: 'login', route_after:req.query.ra||''})
})
.post('/login', function(req, res){
  User.existsAndIsValid(req, res, {mail:req.body._umail_, password:req.body._upassword_, route_after:req.body.route_after})
})
.get('/logout', function(req,res){
  if ( User.current ) {
    Dialog.annonce(`À bientôt, ${User.current.pseudo} !`)
    delete req.session.user_id
    delete req.session.session_id
    delete User.current
  }
  res.redirect('/')
})
.get('/modules', async function(req, res){
  global.AbsModule = require('./models/AbsModule')
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
.get('*', function(req,res){
  Dialog.error("Cette route est inconnue du site…")
  res.redirect('/')
})

var server = app.listen(process.env.ALWAYSDATA_HTTPD_PORT||3000, process.env.ALWAYSDATA_HTTPD_IP, function () {
  console.log('Example app started!')
  // server.close(function() { console.log('Doh :('); });
})
.on('close', () => {
  console.log("Je quitte l'application.")
  DB.stop()
})

module.exports = server
