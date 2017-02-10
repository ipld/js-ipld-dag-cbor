/* eslint-env mocha */
/* eslint max-nested-callbacks: ["error", 8] */

'use strict'

const expect = require('chai').expect
const dagCBOR = require('../src')
const loadFixture = require('aegir/fixtures')
const bs58 = require('bs58')
const isNode = require('detect-node')

const arrayLinkCBOR = loadFixture(__dirname, '/fixtures/array-link.cbor')
const arrayLinkJSON = require('./fixtures/array-link.json')

const emptyArrayCBOR = loadFixture(__dirname, '/fixtures/empty-array.cbor')
const emptyArrayJSON = require('./fixtures/empty-array.json')

const emptyObjCBOR = loadFixture(__dirname, '/fixtures/empty-obj.cbor')
const emptyObjJSON = require('./fixtures/empty-obj.json')

const fooCBOR = loadFixture(__dirname, '/fixtures/foo.cbor')
const fooJSON = require('./fixtures/foo.json')

const objNoLinkCBOR = loadFixture(__dirname, '/fixtures/obj-no-link.cbor')
const objNoLinkJSON = require('./fixtures/obj-no-link.json')

const objWithLinkCBOR = loadFixture(__dirname, '/fixtures/obj-with-link.cbor')
const objWithLinkJSON = require('./fixtures/obj-with-link.json')

const expectedCIDs = require('./fixtures/expected.json')

describe('dag-cbor interop tests', () => {
  // the fixtures feature needs to be fixed
  if (!isNode) { return }

  describe('deserialize and compare', () => {
    it('array-link', (done) => {
      dagCBOR.util.deserialize(arrayLinkCBOR, (err, node) => {
        expect(err).to.not.exist
        // the JSON version that gets out of go-ipfs stringifies the CID
        const bs58Str = bs58.encode(node[0]['/'])

        node[0]['/'] = bs58Str
        expect(node).to.eql(arrayLinkJSON)

        // put it back to bytes
        node[0]['/'] = bs58.decode(arrayLinkJSON[0]['/'])

        dagCBOR.util.cid(node, (err, cid) => {
          expect(err).to.not.exist
          const cidStr = cid.toBaseEncodedString()
          expect(cidStr).to.eql(expectedCIDs['array-link']['/'])
          done()
        })
      })
    })

    it('empty-array', (done) => {
      dagCBOR.util.deserialize(emptyArrayCBOR, (err, node) => {
        expect(err).to.not.exist
        expect(node).to.eql(emptyArrayJSON)

        dagCBOR.util.cid(node, (err, cid) => {
          expect(err).to.not.exist
          const cidStr = cid.toBaseEncodedString()
          expect(cidStr).to.eql(expectedCIDs['empty-array']['/'])
          done()
        })
      })
    })

    it('empty-obj', (done) => {
      dagCBOR.util.deserialize(emptyObjCBOR, (err, node) => {
        expect(err).to.not.exist
        expect(node).to.eql(emptyObjJSON)

        dagCBOR.util.cid(node, (err, cid) => {
          expect(err).to.not.exist
          const cidStr = cid.toBaseEncodedString()
          expect(cidStr).to.eql(expectedCIDs['empty-obj']['/'])
          done()
        })
      })
    })

    it.skip('foo', (done) => {
      dagCBOR.util.deserialize(fooCBOR, (err, node) => {
        expect(err).to.not.exist
        expect(node).to.eql(fooJSON)

        dagCBOR.util.cid(node, (err, cid) => {
          expect(err).to.not.exist
          const cidStr = cid.toBaseEncodedString()
          expect(cidStr).to.eql(expectedCIDs['foo']['/'])
          done()
        })
      })
    })

    it('obj-no-link', (done) => {
      dagCBOR.util.deserialize(objNoLinkCBOR, (err, node) => {
        expect(err).to.not.exist
        expect(node).to.eql(objNoLinkJSON)

        dagCBOR.util.cid(node, (err, cid) => {
          expect(err).to.not.exist
          const cidStr = cid.toBaseEncodedString()
          expect(cidStr).to.eql(expectedCIDs['obj-no-link']['/'])
          done()
        })
      })
    })

    it('obj-with-link', (done) => {
      if (!isNode) { done() }

      dagCBOR.util.deserialize(objWithLinkCBOR, (err, node) => {
        expect(err).to.not.exist

        dagCBOR.util.cid(node, (err, cid) => {
          expect(err).to.not.exist
          const cidStr = cid.toBaseEncodedString()
          expect(cidStr).to.eql(expectedCIDs['obj-with-link']['/'])
          done()
        })
      })
    })
  })

  describe('serialise and compare', () => {
    it('array-link', (done) => {
      arrayLinkJSON[0]['/'] = bs58.decode(arrayLinkJSON[0]['/'])

      dagCBOR.util.serialize(arrayLinkJSON, (err, serialized) => {
        expect(err).to.not.exist

        expect(serialized).to.eql(arrayLinkCBOR)
        done()
      })
    })

    it('empty-array', (done) => {
      dagCBOR.util.serialize(emptyArrayJSON, (err, serialized) => {
        expect(err).to.not.exist
        expect(serialized).to.eql(emptyArrayCBOR)
        done()
      })
    })

    it('empty-obj', (done) => {
      dagCBOR.util.serialize(emptyObjJSON, (err, serialized) => {
        expect(err).to.not.exist
        expect(serialized).to.eql(emptyObjCBOR)
        done()
      })
    })

    it.skip('foo', (done) => {})

    it('obj-no-link', (done) => {
      dagCBOR.util.serialize(objNoLinkJSON, (err, serialized) => {
        expect(err).to.not.exist
        expect(serialized).to.eql(objNoLinkCBOR)
        done()
      })
    })

    it('obj-with-link', (done) => {
      objWithLinkJSON.foo['/'] = bs58.decode(objWithLinkJSON.foo['/'])

      dagCBOR.util.serialize(objWithLinkJSON, (err, serialized) => {
        expect(err).to.not.exist
        expect(serialized).to.eql(objWithLinkCBOR)
        done()
      })
    })
  })
})
