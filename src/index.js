'use strict'

var cbor = require('cbor')
var cborSync = require('cbor-sync')

var clone = require('./clone')
var remapKeys = require('remap-keys')

exports = module.exports

var type = {
  mlink: 'http://merkle-link'
}

var context = {
  merkleweb: {
    mlink: type.mlink
  }
}

exports.context = context
exports.type = type

exports.expand = function (obj, contexts) {
  var objC = clone(obj) // clone to not mess with original obj
  var ctx = []

  if (objC['@context']) {
    ctx.push(objC['@context'])
    delete objC['@context']
  }

  if (contexts) {
    if (Array.isArray(contexts)) {
      contexts.forEach(function (context) {
        ctx.push(context)
      })
    } else {
      ctx.push(contexts)
    }
  }

  ctx.forEach(function (context) {
    objC = remapKeys(objC, context)
  })

  return objC
}

exports.marshal = function (obj) {
  return cbor.encode(obj)
}

exports.unmarshal = function (buf) {
  return cborSync.decode(buf)
}

exports.unmarshalAsync = function (buf, cb) {
  cbor.decodeAll(buf, cb)
}
