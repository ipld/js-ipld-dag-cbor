/* eslint-env mocha */
'use strict'

const { expect } = require('aegir/utils/chai')
const garbage = require('garbage')
const dagCBOR = require('../src')
const multihash = require('multihashes')
const CID = require('cids')
const uint8ArrayFromString = require('uint8arrays/from-string')
const uint8ArrayConcat = require('uint8arrays/concat')

describe('util', () => {
  const obj = {
    someKey: 'someValue',
    link: new CID('QmRgutAxd8t7oGkSm4wmeuByG6M51wcTso6cubDdQtuEfL'),
    links: [
      new CID('QmRgutAxd8t7oGkSm4wmeuByG6M51wcTso6cubDdQtuEfL'),
      new CID('QmRgutAxd8t7oGkSm4wmeuByG6M51wcTso6cubDdQtuEfL')
    ],
    nested: {
      hello: 'world',
      link: new CID('QmRgutAxd8t7oGkSm4wmeuByG6M51wcTso6cubDdQtuEfL')
    }
  }
  const serializedObj = dagCBOR.util.serialize(obj)

  it('.serialize and .deserialize', () => {
    expect(serializedObj).to.be.a('Uint8Array')

    // Check for the tag 42
    // d8 = tag, 2a = 42
    expect(
      serializedObj.toString('hex').match(/d82a/g)
    ).to.have.length(4)

    const deserializedObj = dagCBOR.util.deserialize(serializedObj)
    expect(obj).to.eql(deserializedObj)
  })

  it('.serialize and .deserialize large objects', () => {
    // larger than the default borc heap size, should auto-grow the heap
    const dataSize = 128 * 1024
    const largeObj = { someKey: [].slice.call(new Uint8Array(dataSize)) }

    const serialized = dagCBOR.util.serialize(largeObj)
    expect(serialized).to.be.a('Uint8Array')

    const deserialized = dagCBOR.util.deserialize(serialized)
    expect(largeObj).to.eql(deserialized)
    // reset decoder to default
    dagCBOR.util.configureDecoder()
  })

  it('.deserialize fail on large objects beyond maxSize', () => {
    // larger than the default borc heap size, should bust the heap if we turn off auto-grow
    const dataSize = (128 * 1024) + 1
    const largeObj = { someKey: [].slice.call(new Uint8Array(dataSize)) }

    dagCBOR.util.configureDecoder({ size: 64 * 1024, maxSize: 128 * 1024 }) // 64 Kb start, 128 Kb max
    const serialized = dagCBOR.util.serialize(largeObj)
    expect(serialized).to.be.a('Uint8Array')

    expect(() => dagCBOR.util.deserialize(serialized)).to.throw(
      'Data is too large to deserialize with current decoder')
    // reset decoder to default
    dagCBOR.util.configureDecoder()
  })

  it('.serialize and .deserialize object with slash as property', () => {
    const slashObject = { '/': true }
    const serialized = dagCBOR.util.serialize(slashObject)
    const deserialized = dagCBOR.util.deserialize(serialized)
    expect(deserialized).to.eql(slashObject)
  })

  it('error catching', () => {
    const circlarObj = {}
    circlarObj.a = circlarObj
    expect(() => dagCBOR.util.serialize(circlarObj)).to.throw(
      'The object passed has circular reference')
  })

  it('.cid', async () => {
    const cid = await dagCBOR.util.cid(serializedObj)
    expect(cid.version).to.equal(1)
    expect(cid.codec).to.equal('dag-cbor')
    expect(cid.multihash).to.exist()
    const mh = multihash.decode(cid.multihash)
    expect(mh.name).to.equal('sha2-256')
  })

  it('.cid with hashAlg', async () => {
    const cid = await dagCBOR.util.cid(serializedObj, { hashAlg: 'sha2-512' })
    expect(cid.version).to.equal(1)
    expect(cid.codec).to.equal('dag-cbor')
    expect(cid.multihash).to.exist()
    const mh = multihash.decode(cid.multihash)
    expect(mh.name).to.equal('sha2-512')
    expect(mh.length).to.equal(64)
  })

  it('fuzz serialize and deserialize with garbage', () => {
    for (let ii = 0; ii < 1000; ii++) {
      const original = { in: garbage(100) }
      const encoded = dagCBOR.util.serialize(original)
      const decoded = dagCBOR.util.deserialize(encoded)
      expect(decoded).to.eql(original)
    }
  })

  it('.serialize and .deserialize object with Uint8Array field', () => {
    const buffer = uint8ArrayFromString('some data')
    const bytes = Uint8Array.from(buffer)

    const s1 = dagCBOR.util.serialize({ data: buffer })
    const s2 = dagCBOR.util.serialize({ data: bytes })

    expect(s1).to.be.eql(s2)

    expect(dagCBOR.util.deserialize(s1)).to.be.eql({ data: bytes })
    expect(dagCBOR.util.deserialize(s2)).to.be.eql({ data: bytes })
  })

  it('reject extraneous, but valid CBOR data after initial top-level object', () => {
    expect(() =>
      // two top-level CBOR objects, the original and a single uint=0, valid if using
      // CBOR in streaming mode, not valid here
      dagCBOR.util.deserialize(uint8ArrayConcat([serializedObj, new Uint8Array(1)]))
    ).to.throw(Error, 'Extraneous CBOR data found beyond initial top-level object')
  })
})
