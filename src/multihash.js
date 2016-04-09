'use strict'

const multihashing = require('multihashing')
const bs58 = require('bs58')

exports = module.exports = function multihash (obj) {
  if (obj.marshal && typeof obj.marshal === 'function') {
    // Handle IPLD like objects
    obj = obj.marshal()
  }

  const multi = multihashing(obj, 'sha2-256')
  return bs58.encode(multi)
}
