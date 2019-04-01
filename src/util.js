'use strict'

const cbor = require('borc')
const multihashing = require('multihashing-async')
const CID = require('cids')
const isCircular = require('is-circular')

const resolver = require('./resolver')

// https://github.com/ipfs/go-ipfs/issues/3570#issuecomment-273931692
const CID_CBOR_TAG = 42

function tagCID (cid) {
  if (typeof cid === 'string') {
    cid = new CID(cid).buffer
  } else if (CID.isCID(cid)) {
    cid = cid.buffer
  }

  return new cbor.Tagged(CID_CBOR_TAG, Buffer.concat([
    Buffer.from('00', 'hex'), // thanks jdag
    cid
  ]))
}

function replaceCIDbyTAG (dagNode) {
  let circular
  try {
    circular = isCircular(dagNode)
  } catch (e) {
    circular = false
  }
  if (circular) {
    throw new Error('The object passed has circular references')
  }

  function transform (obj) {
    if (!obj || Buffer.isBuffer(obj) || typeof obj === 'string') {
      return obj
    }

    if (Array.isArray(obj)) {
      return obj.map(transform)
    }

    if (CID.isCID(obj)) {
      return tagCID(obj)
    }

    const keys = Object.keys(obj)

    if (keys.length === 1 && keys[0] === '/') {
      // Multiaddr encoding
      // if (typeof link === 'string' && isMultiaddr(link)) {
      //  link = new Multiaddr(link).buffer
      // }

      return tagCID(obj['/'])
    } else if (keys.length > 0) {
      // Recursive transform
      const out = {}
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

const defaultTags = {
  [CID_CBOR_TAG]: (val) => {
    // remove that 0
    val = val.slice(1)
    return new CID(val)
  }
}
const defaultSize = 64 * 1024 // current decoder heap size, 64 Kb
let currentSize = defaultSize
const defaultMaxSize = 64 * 1024 * 1024 // max heap size when auto-growing, 64 Mb
let maxSize = defaultMaxSize
let decoder = null

exports.configureDecoder = (options) => {
  let tags = defaultTags

  if (options) {
    if (typeof options.size === 'number') {
      currentSize = options.size
    }
    if (typeof options.maxSize === 'number') {
      maxSize = options.maxSize
    }
    if (options.tags) {
      tags = Object.assign({}, defaultTags, options && options.tags)
    }
  } else {
    // no options, reset to defaults
    currentSize = defaultSize
    maxSize = defaultMaxSize
  }

  let decoderOptions = {
    tags: tags,
    size: currentSize
  }

  decoder = new cbor.Decoder(decoderOptions)
  // borc edits opts.size in-place so we can capture _actual_ size
  currentSize = decoderOptions.size
}

exports.configureDecoder() // Setup default cbor.Decoder

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

  if (data.length > currentSize && data.length <= maxSize) {
    exports.configureDecoder({ size: data.length })
  }

  if (data.length > currentSize) {
    return setImmediate(() => callback(new Error('Data is too large to deserialize with current decoder')))
  }

  try {
    deserialized = decoder.decodeFirst(data)
  } catch (err) {
    return setImmediate(() => callback(err))
  }

  setImmediate(() => callback(null, deserialized))
}

/**
 * @callback CidCallback
 * @param {?Error} error - Error if getting the CID failed
 * @param {?CID} cid - CID if call was successful
 */
/**
 * Get the CID of the DAG-Node.
 *
 * @param {Object} dagNode - Internal representation
 * @param {Object} [options] - Options to create the CID
 * @param {number} [options.version=1] - CID version number
 * @param {string} [options.hashAlg] - Defaults to hashAlg for the resolver
 * @param {number} [options.hashLen] - Optionally trim the digest to this length
 * @param {CidCallback} callback - Callback that handles the return value
 * @returns {void}
 */
exports.cid = (dagNode, options, callback) => {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  options = options || {}
  const hashAlg = options.hashAlg || resolver.defaultHashAlg
  const hashLen = options.hashLen
  const version = typeof options.version === 'undefined' ? 1 : options.version

  exports.serialize(dagNode, (err, serialized) => {
    if (err) return callback(err)
    multihashing(serialized, hashAlg, hashLen, (err, mh) => {
      if (err) return callback(err)
      callback(null, new CID(version, resolver.multicodec, mh))
    })
  })
}
