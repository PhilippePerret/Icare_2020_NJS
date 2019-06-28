'use strict'

export class ExpectSubject {

static get not(){
  this.positive = false
  return this
}

static get positive(){
  if ( undefined === this._positive ) this._positive = true
  return this._positive
}

static set positive(v){this._positive = v}

}
