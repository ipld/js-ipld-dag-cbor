var fs = require('fs')
var path = require('path')
var cbor = require('cbor')

exports = module.exports

var versions = fs.readFileSync(path.resolve(__dirname, '../versions'), 'utf8').split('\n')

var context = {
  merkleweb: 'http://gateway.ipfs.io/ipfs/' + versions[versions.length - 2] + '/merkleweb',
  exampleJSONLD: 'http://gateway.ipfs.io/ipfs/' + versions[versions.length - 2] + '/example-jsonld'
}

var types = {
  mlink: 'http://merkle-link'
}

exports.context = context

exports.types = types

exports.addLink = function (obj, key, hash) {
  if (obj[key]) {
    return new Error('key already exists on object')
  }

  obj[key] = {
    '@type': types.mlink,
    '@value': hash
  }

}

exports.marshal = function (obj) {
  return cbor.encode(obj)
}

exports.unmarshal = function (buf, cb) {
  cbor.decode(buf, cb)
}
