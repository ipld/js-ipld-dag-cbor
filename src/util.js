'use strict'

const cbor = require('cbor-sync')
const multihashing = require('multihashing')
const CID = require('cids')
const resolver = require('./resolver')

exports = module.exports

exports.serialize = (dagNode) => {
  return cbor.encode(dagNode)
}

exports.deserialize = (data) => {
  return cbor.decode(data)
}

exports.cid = (dagNode) => {
  const serialized = exports.serialize(dagNode)
  const mh = multihashing(serialized, 'sha2-256')
  return new CID(1, resolver.multicodec, mh)
}
