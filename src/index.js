'use strict'

const util = require('./util.js')

module.exports = {
  util,
  resolver: require('./resolver.js'),
  codec: util.codec,
  defaultHashAlg: util.defaultHashAlg
}
