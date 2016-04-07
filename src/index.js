'use strict'

const cbor = require('./cbor')

exports = module.exports

exports.LINK_TAG = cbor.LINK_TAG
exports.marshal = cbor.marshal
exports.unmarshal = cbor.unmarshal
