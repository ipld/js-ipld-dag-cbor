/* eslint-env mocha */
/* eslint max-nested-callbacks: ["error", 8] */

'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)
const dagCBOR = require('../src')
const loadFixture = require('aegir/fixtures')
const isNode = require('detect-node')

const arrayLinkCBOR = loadFixture('test/fixtures/array-link.cbor')
const arrayLinkJS = require('./fixtures/array-link')

const emptyArrayCBOR = loadFixture('test/fixtures/empty-array.cbor')
const emptyArrayJS = require('./fixtures/empty-array')

const emptyObjCBOR = loadFixture('test/fixtures/empty-obj.cbor')
const emptyObjJS = require('./fixtures/empty-obj')

const fooCBOR = loadFixture('test/fixtures/foo.cbor')
const fooJS = require('./fixtures/foo')

const objNoLinkCBOR = loadFixture('test/fixtures/obj-no-link.cbor')
const objNoLinkJS = require('./fixtures/obj-no-link')

const objWithLinkCBOR = loadFixture('test/fixtures/obj-with-link.cbor')
const objWithLinkJS = require('./fixtures/obj-with-link')

const expectedCIDs = require('./fixtures/expected')

describe('dag-cbor interop tests', () => {
  // the fixtures feature needs to be fixed
  if (!isNode) { return }

  describe('deserialize and compare', () => {
    it('array-link', (done) => {
      dagCBOR.util.deserialize(arrayLinkCBOR, (err, node) => {
        expect(err).to.not.exist()

        dagCBOR.util.cid(node, (err, cid) => {
          expect(err).to.not.exist()
          expect(cid.equals(expectedCIDs['array-link'])).to.be.true()
          done()
        })
      })
    })

    it('empty-array', (done) => {
      dagCBOR.util.deserialize(emptyArrayCBOR, (err, node) => {
        expect(err).to.not.exist()
        expect(node).to.eql(emptyArrayJS)

        dagCBOR.util.cid(node, (err, cid) => {
          expect(err).to.not.exist()
          expect(cid.equals(expectedCIDs['empty-array'])).to.be.true()
          done()
        })
      })
    })

    it('empty-obj', (done) => {
      dagCBOR.util.deserialize(emptyObjCBOR, (err, node) => {
        expect(err).to.not.exist()
        expect(node).to.eql(emptyObjJS)

        dagCBOR.util.cid(node, (err, cid) => {
          expect(err).to.not.exist()
          expect(cid.equals(expectedCIDs['empty-obj'])).to.be.true()
          done()
        })
      })
    })

    it.skip('foo', (done) => {
      dagCBOR.util.deserialize(fooCBOR, (err, node) => {
        expect(err).to.not.exist()
        expect(node).to.eql(fooJS)

        dagCBOR.util.cid(node, (err, cid) => {
          expect(err).to.not.exist()
          expect(cid.equals(expectedCIDs.foo)).to.be.true()
          done()
        })
      })
    })

    it('obj-no-link', (done) => {
      dagCBOR.util.deserialize(objNoLinkCBOR, (err, node) => {
        expect(err).to.not.exist()
        expect(node).to.eql(objNoLinkJS)

        dagCBOR.util.cid(node, (err, cid) => {
          expect(err).to.not.exist()
          expect(cid.equals(expectedCIDs['obj-no-link'])).to.be.true()
          done()
        })
      })
    })

    it('obj-with-link', (done) => {
      if (!isNode) { done() }

      dagCBOR.util.deserialize(objWithLinkCBOR, (err, node) => {
        expect(err).to.not.exist()

        dagCBOR.util.cid(node, (err, cid) => {
          expect(err).to.not.exist()
          expect(cid.equals(expectedCIDs['obj-with-link'])).to.be.true()
          done()
        })
      })
    })
  })

  describe('serialise and compare', () => {
    it('array-link', (done) => {
      dagCBOR.util.serialize(arrayLinkJS, (err, serialized) => {
        expect(err).to.not.exist()

        expect(serialized).to.eql(arrayLinkCBOR)
        done()
      })
    })

    it('empty-array', (done) => {
      dagCBOR.util.serialize(emptyArrayJS, (err, serialized) => {
        expect(err).to.not.exist()
        expect(serialized).to.eql(emptyArrayCBOR)
        done()
      })
    })

    it('empty-obj', (done) => {
      dagCBOR.util.serialize(emptyObjJS, (err, serialized) => {
        expect(err).to.not.exist()
        expect(serialized).to.eql(emptyObjCBOR)
        done()
      })
    })

    it.skip('foo', (done) => {})

    it('obj-no-link', (done) => {
      dagCBOR.util.serialize(objNoLinkJS, (err, serialized) => {
        expect(err).to.not.exist()
        expect(serialized).to.eql(objNoLinkCBOR)
        done()
      })
    })

    it('obj-with-link', (done) => {
      dagCBOR.util.serialize(objWithLinkJS, (err, serialized) => {
        expect(err).to.not.exist()
        expect(serialized).to.eql(objWithLinkCBOR)
        done()
      })
    })
  })
})
