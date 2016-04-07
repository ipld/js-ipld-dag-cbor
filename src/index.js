'use strict'

const crypto = require('crypto')
const multihash = require('multihashes')
const bs58 = require('bs58')

const cbor = require('./cbor')
const resolve = require('./resolve')

exports = module.exports

class IPLD {
  constructor (data) {
    this.cbor = cbor.marshal(data)
  }

  unmarshal () {
    return cbor.unmarshal(this.cbor)
  }

  resolve (path) {
    return resolve(this, path)
  }

  get hash () {
    const hash = crypto.createHash('sha256')
            .update(this.cbor).digest()

    const multi = multihash(hash, 'sha2-256')

    return bs58.encode(multi)
  }
}

exports.IPLD = IPLD

exports.LINK_TAG = cbor.LINK_TAG
exports.marshal = cbor.marshal
exports.unmarshal = cbor.unmarshal
exports.resolve = resolve
