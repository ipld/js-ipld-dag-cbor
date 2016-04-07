'use strict'

const cbor = require('./cbor')
const multihash = require('./multihash')

exports = module.exports

exports.LINK_TAG = cbor.LINK_TAG
exports.marshal = cbor.marshal
exports.unmarshal = cbor.unmarshal
exports.multihash = multihash
