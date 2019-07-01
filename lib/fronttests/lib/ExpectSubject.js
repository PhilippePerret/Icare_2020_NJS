'use strict'

export class ExpectSubject {

static get not(){
  this.positive = false
  return this // chainage
}
get not(){
  this.positive = false
  return this // chainage
}

static get positive(){
  if ( undefined === this._positive ) this._positive = true
  return this._positive
}
get positive(){
  if ( undefined === this._positive ) this._positive = true
  return this._positive
}

static set positive(v){this._positive = v}
set positive(v){this._positive = v}
}
