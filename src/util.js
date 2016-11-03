'use strict'

const cbor = require('cbor')
const multihashing = require('multihashing-async')
const CID = require('cids')
const waterfall = require('async/waterfall')

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
  waterfall([
    (cb) => exports.serialize(dagNode, cb),
    (serialized, cb) => multihashing(serialized, 'sha2-256', cb),
    (mh, cb) => cb(null, new CID(1, resolver.multicodec, mh))
  ], callback)
}
