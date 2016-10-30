'use strict'

const cbor = require('cbor')
const multihashing = require('multihashing')
const CID = require('cids')
const resolver = require('./resolver')

exports = module.exports

exports.serialize = (dagNode, callback) => {
  let serialized
  try {
    serialized = cbor.encode(dagNode)
  } catch (err) {
    // return is important, otherwise in case of error the execution would continue
    return callback(err)
  }
  callback(null, serialized)
}

exports.deserialize = (data, callback) => {
  cbor.decodeFirst(data, callback)
}

exports.cid = (dagNode, callback) => {
  exports.serialize(dagNode, (err, serialized) => {
    if (err) {
      return callback(err)
    }
    const mh = multihashing(serialized, 'sha2-256')
    callback(null, new CID(1, resolver.multicodec, mh))
  })
}
