'use strict'

const crypto = require('crypto')
const multihashes = require('multihashes')
const bs58 = require('bs58')

exports = module.exports = function multihash (obj) {
  if (obj.marshal && typeof obj.marshal === 'function') {
    // Handle IPLD like objects
    obj = obj.marshal()
  }

  const hash = crypto.createHash('sha256')
          .update(obj).digest()

  const multi = multihashes(hash, 'sha2-256')

  return bs58.encode(multi)
}
