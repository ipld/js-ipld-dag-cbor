'use strict'

const util = require('./util.js')

/**
 * @typedef {import('interface-ipld-format').Format<object>} ObjectFormat
 */

/**
 * @type {ObjectFormat}
 */
module.exports = {
  util,
  resolver: require('./resolver.js'),
  codec: util.codec,
  defaultHashAlg: util.defaultHashAlg
}
