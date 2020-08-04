/* eslint-env mocha */
/* eslint max-nested-callbacks: ["error", 5] */
'use strict'

const { expect } = require('aegir/utils/chai')
const CID = require('cids')
const dagCBOR = require('../src')
const resolver = dagCBOR.resolver

describe('IPLD format resolver (local)', () => {
  const emptyNode = {}
  const node = {
    name: 'I am a node',
    someLink: new CID('QmaNh5d3hFiqJAGjHmvxihSnWDGqYZCn7H2XHpbttYjCNE'),
    nest: {
      foo: {
        bar: 'baz'
      }
    },
    array: [
      { a: 'b' },
      2
    ],
    nullValue: null,
    boolValue: true
  }

  const emptyNodeBlob = dagCBOR.util.serialize(emptyNode)
  const nodeBlob = dagCBOR.util.serialize(node)

  describe('empty node', () => {
    describe('resolver.resolve', () => {
      it('root', () => {
        const result = resolver.resolve(emptyNodeBlob, '/')
        expect(result.value).to.be.eql({})
      })
    })

    it('resolver.tree', () => {
      const paths = resolver.tree(emptyNodeBlob).next()
      expect(paths.value).to.be.undefined()
      expect(paths.done).to.be.true()
    })
  })

  describe('node', () => {
    it('resolver.tree', () => {
      const tree = resolver.tree(nodeBlob)
      const paths = [...tree]
      expect(paths).to.have.members([
        'name',
        'nest',
        'nest/foo',
        'nest/foo/bar',
        'array',
        'array/0',
        'array/0/a',
        'array/1',
        'someLink',
        'boolValue',
        'nullValue'
      ])
    })

    describe('resolver.resolve', () => {
      it('path within scope', () => {
        const result = resolver.resolve(nodeBlob, 'name')
        expect(result.value).to.equal('I am a node')
      })

      it('path within scope, but nested', () => {
        const result = resolver.resolve(nodeBlob, 'nest/foo/bar')
        expect(result.value).to.equal('baz')
      })

      it('should resolve falsy values for path within scope', () => {
        const falsyNode = {
          nu11: null,
          f4lse: false,
          empty: '',
          zero: 0
        }

        const falsyNodeBlob = dagCBOR.util.serialize(falsyNode)

        Object.keys(falsyNode).map((key) => {
          const result = resolver.resolve(falsyNodeBlob, key)
          expect(result.value).to.equal(falsyNode[key])
        })
      })

      it('path out of scope', () => {
        const result = resolver.resolve(nodeBlob, 'someLink/a/b/c')
        expect(result.value.equals(
          new CID('QmaNh5d3hFiqJAGjHmvxihSnWDGqYZCn7H2XHpbttYjCNE'))
        ).to.be.true()
        expect(result.remainderPath).to.equal('a/b/c')
      })
    })
  })
})
