/* eslint-env mocha */
'use strict'

const expect = require('chai').expect
const dagCBOR = require('../src')

describe('util', () => {
  const obj = {
    'someKey': 'someValue',
    'link': { '/': 'aaaaa' }
  }

  it('.serialize and .deserialize', () => {
    const serialized = dagCBOR.util.serialize(obj)
    expect(Buffer.isBuffer(serialized)).to.be.true

    const deserialized = dagCBOR.util.deserialize(serialized)
    expect(obj).to.eql(deserialized)
  })

  it('.cid', () => {
    const cid = dagCBOR.util.cid(obj)
    expect(cid.version).to.equal(1)
    expect(cid.codec).to.equal('dag-cbor')
    expect(cid.multihash).to.exist
  })
})
