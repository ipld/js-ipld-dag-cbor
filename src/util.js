'use strict'

const cbor = require('borc')
const multihashing = require('multihashing')
const CID = require('cids')
const isCircular = require('is-circular')

const resolver = require('./resolver')

// https://github.com/ipfs/go-ipfs/issues/3570#issuecomment-273931692
const CID_CBOR_TAG = 42

function tagCID (cid) {
  if (typeof cid === 'string') {
    cid = new CID(cid).buffer
  }

  return new cbor.Tagged(CID_CBOR_TAG, Buffer.concat([
    new Buffer('00', 'hex'), // thanks jdag
    cid
  ]))
}

const decoder = new cbor.Decoder({
  tags: {
    [CID_CBOR_TAG]: (val) => {
      // remove that 0
      val = val.slice(1)
      return {'/': val}
    }
  }
})

function replaceCIDbyTAG (dagNode) {
  if (isCircular(dagNode)) {
    throw new Error('The object passed has circular references')
  }

  function transform (obj) {
    if (!obj || Buffer.isBuffer(obj) || typeof obj === 'string') {
      return obj
    }

    if (Array.isArray(obj)) {
      return obj.map(transform)
    }

    const keys = Object.keys(obj)

    // only `{'/': 'link'}` are valid
    if (keys.length === 1 && keys[0] === '/') {
      // Multiaddr encoding
      // if (typeof link === 'string' && isMultiaddr(link)) {
      //  link = new Multiaddr(link).buffer
      // }

      return tagCID(obj['/'])
    } else if (keys.length > 0) {
      // Recursive transform
      let out = {}
      keys.forEach((key) => {
        if (typeof obj[key] === 'object') {
          out[key] = transform(obj[key])
        } else {
          out[key] = obj[key]
        }
      })
      return out
    } else {
      return obj
    }
  }

  return transform(dagNode)
}

exports = module.exports

exports.serialize = (dagNode) => {
  const dagNodeTagged = replaceCIDbyTAG(dagNode)
  return cbor.encode(dagNodeTagged)
}

exports.deserialize = (data) => {
  return decoder.decodeFirst(data)
}

exports.cid = (dagNode) => {
  const serialized = exports.serialize(dagNode)
  const mh = multihashing(serialized, 'sha2-256')
  return new CID(1, resolver.multicodec, mh)
}
