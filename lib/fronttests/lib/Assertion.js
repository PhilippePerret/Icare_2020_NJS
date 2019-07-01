'use strict'

window.Assertion = class {
  constructor(pass, positive, messages){
    this.pass     = pass === positive
    this.positive = positive
    this.messages = messages
  }

  evaluate(options){
    if ( options && options.onlyReturn ) return this.pass
    window[this.pass?'success':'failure'](this.finalMessage)
    if ( FrontTests.failFast && this.pass === false ) {
      throw new Error("FAIL FAST STOP")
    }
  }

  get finalMessage(){
    if ( this.pass ) {
      return this.messages[`${this.positive?'pos':'neg'}_success`]
    } else {
      return this.messages[`${this.positive?'pos':'neg'}_failure`]
    }
  }
}
