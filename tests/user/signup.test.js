'use strict'

const request = require('supertest')
// const should = require('should');
const app = require('../../')

global.Tests = require('/Users/philippeperret/Programmation/FilmAnalyzor/FITests')
Tests.initForExpectOnly()
// console.log("Tests:", Tests)

describe("ça", function(done){
  it("fait ça", function(done){
    request(app)
      .get('/signup')
      .expect((res) => {
        // console.log("res = ", res)
        var ret = expect(t("Un texte")).contains("bonjour")
        if ( ! ret.ok ) throw new Error(ret.message)
        console.log("ret = ", ret)
      })
      .end(done)
      //   if ( err ) console.error(err)
      //   // console.log(res)
      //   // console.log(res.text) // pour obtenir tout le texte de la page
      //   var ret
      //   ret = expect(t(res.text)).contains("<h1>Candidater à l’Atelier Icare</h1>")
      //   console.log("ret = ", ret)
      //   done()
      // })
  })
  it("peut s'inscrire avec les bonnes données", function(done){
    request(app)
      .post('/signup')
      .send({upseudo: "Son pseudo", umail:"Son mail"})
      .end((err,res) => {
        done()
      })
  })
})
