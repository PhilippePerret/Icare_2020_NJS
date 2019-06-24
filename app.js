const express = require('express')
const app = express()

app.use(express.static('lib'))
app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', function (req, res) {
  // res.send('Salut tout le monde !')
  res.render('index', {title:"Atelier Icare", message:"Salut tout le monde !"})
})

app.listen(process.env.ALWAYSDATA_HTTPD_PORT||3000, process.env.ALWAYSDATA_HTTPD_IP, function () {
  console.log('Example app started!')
})
// app.listen(process.env.ALWAYSDATA_HTTPD_PORT, process.env.ALWAYSDATA_HTTPD_IP, function () {
//   console.log('Example app started!')
// })
