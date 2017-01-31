'use strict'

const cbor = require('borc')
const multihashing = require('multihashing-async')
const CID = require('cids')
const waterfall = require('async/waterfall')
const setImmediate = require('async/setImmediate')
const cloneDeep = require('lodash.clonedeep')
const includes = require('lodash.includes')
const defaults = require('lodash.defaults')
const isCircular = require('is-circular')

const resolver = require('./resolver')

function tagCID (cid) {
  // https://github.com/ipfs/go-ipfs/issues/3570#issuecomment-273931692
  const CID_CBOR_TAG = 42

  return new cbor.Tagged(CID_CBOR_TAG, cid)
}

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

function replaceTAGbyCID (dagNode) {
  function transform (obj) {
    Object.keys(obj).forEach((key) => {
      const val = obj[key]

      if (val instanceof cbor.Tagged) {
        if (typeof val.value === 'string') {
          obj[key] = { '/': val.value }
        } else {
          obj[key] = defaults({ '/': val.value[0] }, transform(val.value[1]))
        }
      } else if (typeof val === 'object') {
        obj[key] = transform(val)
      }
    })

    return obj
  }

  return transform(dagNode)
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
    deserialized = cbor.decodeFirst(data)
  } catch (err) {
    return setImmediate(() => callback(err))
  }

  const dagNode = replaceTAGbyCID(deserialized)

  setImmediate(() => callback(null, dagNode))
}

exports.cid = (dagNode, callback) => {
  waterfall([
    (cb) => exports.serialize(dagNode, cb),
    (serialized, cb) => multihashing(serialized, 'sha2-256', cb),
    (mh, cb) => cb(null, new CID(1, resolver.multicodec, mh))
  ], callback)
}
