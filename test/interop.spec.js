/* eslint-env mocha */
'use strict'

const { expect } = require('aegir/utils/chai')
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
    it('array-link', async () => {
      const node = dagCBOR.util.deserialize(arrayLinkCBOR)
      expect(node).to.eql(arrayLinkJS)

      const cid = await dagCBOR.util.cid(arrayLinkCBOR)
      expect(cid.equals(expectedCIDs.arrayLink)).to.be.true()
    })

    it('empty-array', async () => {
      const node = dagCBOR.util.deserialize(emptyArrayCBOR)
      expect(node).to.eql(emptyArrayJS)

      const cid = await dagCBOR.util.cid(emptyArrayCBOR)
      expect(cid.equals(expectedCIDs.emptyArray)).to.be.true()
    })

    it('empty-obj', async () => {
      const node = dagCBOR.util.deserialize(emptyObjCBOR)
      expect(node).to.eql(emptyObjJS)

      const cid = await dagCBOR.util.cid(emptyObjCBOR)
      expect(cid.equals(expectedCIDs.emptyObj)).to.be.true()
    })

    it('foo', async () => {
      const node = dagCBOR.util.deserialize(fooCBOR)
      expect(node).to.eql(fooJS)

      const cid = await dagCBOR.util.cid(fooCBOR)
      expect(cid.equals(expectedCIDs.foo)).to.be.true()
    })

    it('obj-no-link', async () => {
      const node = dagCBOR.util.deserialize(objNoLinkCBOR)
      expect(node).to.eql(objNoLinkJS)

      const cid = await dagCBOR.util.cid(objNoLinkCBOR)
      expect(cid.equals(expectedCIDs.objNoLink)).to.be.true()
    })

    it('obj-with-link', async () => {
      if (!isNode) { return }

      const cid = await dagCBOR.util.cid(objWithLinkCBOR)
      expect(cid.equals(expectedCIDs.objWithLink)).to.be.true()
    })
  })

  describe('serialise and compare', () => {
    it('array-link', () => {
      const serialized = dagCBOR.util.serialize(arrayLinkJS)
      expect(serialized).to.eql(arrayLinkCBOR)
    })

    it('empty-array', () => {
      const serialized = dagCBOR.util.serialize(emptyArrayJS)
      expect(serialized).to.eql(emptyArrayCBOR)
    })

    it('empty-obj', () => {
      const serialized = dagCBOR.util.serialize(emptyObjJS)
      expect(serialized).to.eql(emptyObjCBOR)
    })

    it('foo', () => {
      const serialized = dagCBOR.util.serialize(fooJS)
      expect(serialized).to.eql(fooCBOR)
    })

    it('obj-no-link', () => {
      const serialized = dagCBOR.util.serialize(objNoLinkJS)
      expect(serialized).to.eql(objNoLinkCBOR)
    })

    it('obj-with-link', () => {
      const serialized = dagCBOR.util.serialize(objWithLinkJS)
      expect(serialized).to.eql(objWithLinkCBOR)
    })
  })
})
