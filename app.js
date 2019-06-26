const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const session = require('express-session')

// Mes objets et middlewares
const DB = require('./config/mysql') // DB.connexion

// async function essaiDB(){
//   var res = await DB.query("SELECT * FROM users WHERE id = ?", [1], 'icare_users')
//   console.log("Essai mySql = ", res)
// }
// essaiDB()

global.User = require('./models/User')

function genuuid(){
  var uuid = require('uuid')
  return uuid.v4()
}
// Usings
// Pour les sessions
app.use(session({
  // genid: function(req){return genuuid() /* use UUIDs for session IDs */ },
  secret: 'ATELIERICARE',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use('/assets', express.static(__dirname + '/lib'))

// Settings
app.set('views', './views')
app.set('view engine', 'pug')


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
      console.log("OK, c'est le bon user, je le mémorise")
      User.current = new User(ret)
    }
  } else {
    console.log("Aucun user n'est défini par req.session.user_id")
  }
  next()
})

// Middleware
app.post('/login', function(req, res){
  User.existsAndIsValid(req, {mail:req.body._umail_, password:req.body._upassword_}, (err, user)=>{
    if ( user ) {
      console.log("C'est OK, je mets l'user en session", user.id, user.sessionId)
      req.session.user_id     = user.id
      req.session.session_id  = user.sessionId
      console.log("session.user_id mis à ", req.session.user_id)
      console.log("session.session_id mis à ", req.session.session_id)
      res.redirect(`/user/${user.id}`)
    } else {
      console.log("C'est pas OK du tout")
      res.redirect('/login')
    }
  })
})


app.get('/', function (req, res) {
  // res.send('Salut tout le monde !')
  console.log("req.session.user_id : ", req.session.user_id)
  res.render('gabarit', {place: 'home'})
})
.get('/login', function(req,res){
  res.render('gabarit', {place: 'login'})
})
.get('/user/:user_id', function(req,res){
  res.render('gabarit', {place:'bureau'})
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
.get('/aide', function(req,res){
  res.render('gabarit', {place: 'aide', question: session.question})
  delete session.question
})
.post('/aide', function(req,res){
  session.question = req.body.user_question
  res.redirect('/aide')
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
