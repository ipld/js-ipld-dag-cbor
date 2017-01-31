'use strict'

const cbor = require('borc')
const multihashing = require('multihashing-async')
const CID = require('cids')
const waterfall = require('async/waterfall')
const setImmediate = require('async/setImmediate')
const cloneDeep = require('lodash.clonedeep')
const includes = require('lodash.includes')
const isCircular = require('is-circular')

const resolver = require('./resolver')

// https://github.com/ipfs/go-ipfs/issues/3570#issuecomment-273931692
const CID_CBOR_TAG = 42

function tagCID (cid) {
  return new cbor.Tagged(CID_CBOR_TAG, cid)
}

const decoder = new cbor.Decoder({
  tags: {
    [CID_CBOR_TAG]: (val) => ({'/': val})
  }
})

function replaceCIDbyTAG (dagNode) {
  if (isCircular(dagNode)) {
    throw new Error('The object passes has circular references')
  }

  const copy = cloneDeep(dagNode)

  function transform (obj) {
    const keys = Object.keys(obj)

    // Recursive transform
    keys.forEach((key) => {
      if (typeof obj[key] === 'object') {
        obj[key] = transform(obj[key])
      }
    })

    if (includes(keys, '/')) {
      let cid = obj['/']

      // Multiaddr encoding
      // if (typeof link === 'string' && isMultiaddr(link)) {
      //  link = new Multiaddr(link).buffer
      // }

      delete obj['/'] // Remove the /
      return tagCID(cid)
    }

    return obj
  }

  return transform(copy)
}

exports = module.exports

exports.serialize = (dagNode, callback) => {
  let serialized

  try {
    const dagNodeTagged = replaceCIDbyTAG(dagNode)
    serialized = cbor.encode(dagNodeTagged)
  } catch (err) {
    return setImmediate(() => callback(err))
  }
  setImmediate(() => callback(null, serialized))
}

exports.deserialize = (data, callback) => {
  let deserialized

  try {
    deserialized = decoder.decodeFirst(data)
  } catch (err) {
    return setImmediate(() => callback(err))
  }

  setImmediate(() => callback(null, deserialized))
}

exports.cid = (dagNode, callback) => {
  waterfall([
    (cb) => exports.serialize(dagNode, cb),
    (serialized, cb) => multihashing(serialized, 'sha2-256', cb),
    (mh, cb) => cb(null, new CID(1, resolver.multicodec, mh))
  ], callback)
}
