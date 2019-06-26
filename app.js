const express = require('express')
const flash = require('connect-flash');
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const session = require('express-session')

// Mes objets et middlewares
const DB = require('./config/mysql') // DB.connexion

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
app.use(cookieParser('ATELIERICARECOOKIES'))
app.use(flash())

app.use('/assets', express.static(__dirname + '/lib'))

// Settings
app.set('views', './views')
app.set('view engine', 'pug')

// Middleware
app.use(async (req, res, next) => {
  // On regarde ici si l'user est défini et est correct
  if ( req.session.user_id ) {
    console.log(" un user est défini = ", req.session.user_id)
    var ret = await DB.get('icare_users.users', parseInt(req.session.user_id,10))
    // console.log("Résultat retourné par la base : ", ret)
    // Si l'id de session mémorisé est également à l'id de session de
    // l'utilisateur, c'est que tout va bien. On définit l'utilisateur courant
    console.log("Les deux sessions sont elles OK :")
    console.log(ret.session_id, "(ret.session_id)")
    console.log(req.session.session_id, "(req.session.session_id)")
    if ( ret.session_id == req.session.session_id ) {
      console.log("OK, c'est le bon user, je le prends en user courant")
      User.current = new User(ret)
    }
  } else {
    console.log("Aucun user n'est défini par req.session.user_id")
  }
  next()
})
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


app.post('/login', function(req, res){
  User.existsAndIsValid(req, res, {mail:req.body._umail_, password:req.body._upassword_})
  // User.existsAndIsValid(req, res, {mail:req.body._umail_, password:req.body._upassword_}, (err, user) => {
  //   if ( user instanceof(User) ) {
  //     req.session.user_id     = user.id
  //     req.session.session_id  = user.sessionId
  //     req.flash('annonce', `Bienvenue à l'atelier, ${user.pseudo} !`)
  //     res.redirect(`/bureau/home` /* TODO À RÉGLER EN FONCTION DES OPTIONS */)
  //   } else {
  //     req.flash('error', "Je ne connais aucun icarien avec ce mail/mot de passe. Merci de ré-essayer.")
  //     res.redirect('/login')
  //   }
  // })
})



app.get('/', function (req, res) {
  // res.send('Salut tout le monde !')
  console.log("req.session.user_id : ", req.session.user_id)
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
.get('/signup', function(req,res){
  res.render('gabarit', {place:'signup'})
})
.get('/bureau/(:section)?', function(req,res){
  res.render('gabarit', {place:'bureau', messages: req.flash('info')})
})
.get('/modules', function(req, res){
  res.render('gabarit', {place: 'modules'})
})
.get('/bureau(/:section)?', function(req, res){
  res.render('gabarit', {place: 'bureau'})
})
.get('/admin', function(req, res){
  res.render('gabarit', {place: 'admin'})
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
// app.listen(process.env.ALWAYSDATA_HTTPD_PORT, process.env.ALWAYSDATA_HTTPD_IP, function () {
//   console.log('Example app started!')
// })
