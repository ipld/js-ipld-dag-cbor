'use strict'

const cbor = require('./cbor')
const multihash = require('./multihash')

exports = module.exports

exports.LINK_TAG = cbor.LINK_TAG
exports.LINK_SYMBOL = cbor.LINK_SYMBOL
exports.marshal = cbor.marshal
exports.unmarshal = cbor.unmarshal
exports.multihash = multihash
