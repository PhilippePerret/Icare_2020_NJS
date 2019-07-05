'use strict'

window.Assertion = class {
  constructor(pass, positive, messages){
    this.pass     = pass === positive
    this.positive = positive
    this.messages = messages
    this.options  = {}
  }

  evaluate(options){
    this.options = options || {}
    if ( this.options.onlyReturn ) return this.pass
    window[this.pass?'success':'failure'](this.finalMessage)
    if ( FrontTests.failFast && this.pass === false ) {
      throw new Error("FAIL FAST STOP")
    }
  }

  get finalMessage(){
    if ( this.pass ) {
      return '<span class="picto">✅</span>' + (this.options.success || this.messages[`${this.positive?'pos':'neg'}_success`])
    } else {
      return '<span class="picto">❌</span>' + (this.options.failure || this.messages[`${this.positive?'pos':'neg'}_failure`])
    }
  }
}
