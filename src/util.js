'use strict'

const cbor = require('cbor')
const multihashing = require('multihashing')
const CID = require('cids')
const resolver = require('./resolver')

exports = module.exports

exports.serialize = (dagNode) => {
  return cbor.encode(dagNode)
}

exports.deserialize = (data, callback) => {
  cbor.decodeFirst(data, callback)
}

exports.cid = (dagNode, callback) => {
  const serialized = exports.serialize(dagNode)
  const mh = multihashing(serialized, 'sha2-256')
  callback(null, new CID(1, resolver.multicodec, mh))
}
