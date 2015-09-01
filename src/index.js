var cbor = require('cbor')
var clone = require('./clone')

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

  // so hacky
  var strObj = JSON.stringify(objC)
  ctx.forEach(function (context) {
    Object.keys(context).forEach(function (key) {
      var re = new RegExp(key, 'g')
      strObj = strObj.replace(re, '' + context[key])
    })
  })

  return JSON.parse(strObj)
}

exports.marshal = function (obj) {
  return cbor.encode(obj)
}

exports.unmarshal = function (buf, cb) {
  cbor.decode(buf, cb)
}
