var fs = require('fs')
var path = require('path')

exports = module.exports

var versions = fs.readFileSync(path.resolve(__dirname, '../versions'), 'utf8').split('\n')

console.log(versions[versions.length - 2])

exports.context = {
  merkleweb: 'http://gateway.ipfs.io/ipfs/' + versions[versions.length - 2] + '/merkleweb'
}

exports.types = {
  mlink: 'http://merkle-link'
}

exports.marshal = function () {}

exports.unmarshal = function () {}
