const express = require('express')
const flash = require('connect-flash');
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

// async function essaiDB(){
//   var res = await DB.query("SELECT * FROM users WHERE id = ?", [1], 'icare_users')
//   console.log("Essai mySql = ", res)
// }
// essaiDB()

global.User = require('./models/User')

global.Dialog = class {
  static init() { delete this._message }
  static get message(){return this._message}
  static set message(v){this._message = v}
  static action_required(msg){
    this.message = `<div class="action-required">${msg}</div>`
  }
  static annonce(msg){
    this.message = `<div class="annonce">${msg}</div>`
  }
  static error(msg){
    this.message = `<div class="error">${msg}</div>`
  }
}

// Usings
// Pour les sessions
app.use(session({
  secret: 'ATELIERICARE',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// J'essaie ça pour pouvoir récupérer les valeurs postées dans le middleware
// de FrontTests
app.use(express.urlencoded({ extended: false }))

app.use(cookieParser('ATELIERICARECOOKIES'))
app.use(flash())

app.use('/assets', express.static(__dirname + '/lib'))

global.APPPATH = __dirname

// Settings
app.set('views', './pages')
app.set('view engine', 'pug')


global.PUG = require('pug')

// Middleware
// Reconnecter l'auteur qui s'est identifié (if any)
app.use(User.reconnect)

// middleware
app.use((req, res, next)=>{
  Dialog.init()
  var msg = req.flash('annonce')
  if ( msg.length ){
    console.log("Un message est défini : ", msg)
    Dialog.annonce(msg.join(''))
    // Dialog.message = msg.join('')
  }
  msg = req.flash('action_required')
  if ( msg.length ) {
    Dialog.action_required(msg.join())
  }
  msg = req.flash('error')
  if ( msg.length ) {
    Dialog.error(msg.join())
  }
  next()
})

const FrontTests = require('./lib/fronttests/lib/middleware')
app.use('/ftt(/:action)?', FrontTests.run)

app.post('/login', function(req, res){
  User.existsAndIsValid(req, res, {mail:req.body._umail_, password:req.body._upassword_})
})

app.get('/', function (req, res) {
  // res.send('Salut tout le monde !')
  // console.log("req.session.user_id : ", req.session.user_id)
  res.render('gabarit', {place: 'home'})
})
.get('/login', function(req,res){
  if ( ! Dialog.message ) Dialog.action_required("Merci de vous identifier.")
  res.render('gabarit', {place: 'login'})
})
.get('/logout', function(req,res){
  if ( User.current ) {
    req.flash('annonce', `À bientôt, ${User.current.pseudo} !`)
    delete req.session.user_id
    delete req.session.session_id
    delete User.current
  }
  // TODO Un message pour dire au revoir
  res.redirect('/')
})
.get('/fronttests', function(req,res){
  res.sendFile(__dirname+'/lib/fronttests/html/fronttests.html')
})
.get('/signup', function(req,res){
  var token = uuidv4()
  req.session.form_token = token
  res.render('gabarit', {place:'signup', token:token })
})
.post('/signup', upload.any(), function(req, res){
  FrontTests.checkFields(req)
  const Signup = require('./controllers/user/signup')
  if ( Signup.isValid(req) )
    res.render('gabarit', {place:'signup', action:'confirmation'})
  else
    res.redirect('/signup')
})
.get('/bureau/(:section)?', function(req,res){
  res.render('gabarit', {place:'bureau', messages: req.flash('info')})
})
.get('/modules', async function(req, res){
  global.AbsModule = require('./models/AbsModule')
  await AbsModule.getAllModules()
  res.render('gabarit', {place: 'modules'})
})
.get('/absmodule/:module_id/:action', function(req,res){
  res.render('gabarit', {place:'modules', action:req.params.action, module_id:req.params.module_id})
})
.get('/bureau(/:section)?', function(req, res){
  res.render('gabarit', {place: 'bureau'})
})
.get('/admin(/:section)', async function(req, res){
  if ( User.current && User.current.isAdmin ){
    if ( req.params.section === 'icariens') {
      await User.getAllIcariens()
    }
    res.render('gabarit', {place: 'admin', section:req.params.section})
  } else if ( ! User.current ) {
    res.redirect('/login')
  } else {
    res.render('gabarit', {place:'cul_de_sac'})
  }
})
.get('/aide(/:section)?', function(req,res){
  res.render('gabarit', {place: 'aide', question: req.session.question, section: req.params.section})
  delete req.session.question
})
.post('/aide', function(req,res){
  req.session.question = req.body.user_question
  res.redirect('/aide/reponse')
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
