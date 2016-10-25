/* eslint-env mocha */
'use strict'

const expect = require('chai').expect
const dagCBOR = require('../src')

describe('util', () => {
  const obj = {
    someKey: 'someValue',
    link: { '/': 'aaaaa' }
  }

  it('.serialize and .deserialize', (done) => {
    const serialized = dagCBOR.util.serialize(obj)
    expect(Buffer.isBuffer(serialized)).to.be.true

    dagCBOR.util.deserialize(serialized, (err, deserialized) => {
      expect(err).to.not.exist
      expect(obj).to.eql(deserialized)
      done()
    })
  })

  it('.cid', (done) => {
    dagCBOR.util.cid(obj, (err, cid) => {
      expect(err).to.not.exist
      expect(cid.version).to.equal(1)
      expect(cid.codec).to.equal('dag-cbor')
      expect(cid.multihash).to.exist
      done()
    })
  })
})
