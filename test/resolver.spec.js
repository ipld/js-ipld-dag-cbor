/* eslint-env mocha */
'use strict'

const expect = require('chai').expect
const dagCBOR = require('../src')
const resolver = dagCBOR.resolver
const Block = require('ipfs-block')

describe('IPLD format resolver (local)', () => {
  let emptyNodeBlock
  let nodeBlock

  before(() => {
    const emptyNode = {}
    const node = {
      name: 'I am a node',
      someLink: { '/': 'LINK' },
      nest: {
        foo: {
          bar: 'baz'
        }
      },
      array: [
        { a: 'b' },
        2
      ]

    }

    emptyNodeBlock = new Block(dagCBOR.util.serialize(emptyNode))
    nodeBlock = new Block(dagCBOR.util.serialize(node))
  })

  it('multicodec is dag-cbor', () => {
    expect(resolver.multicodec).to.equal('dag-cbor')
  })

  describe('empty node', () => {
    describe('resolver.resolve', () => {
      it('path within scope', () => {
        const result = resolver.resolve(nodeBlock, 'name')
        expect(result.value).to.equal('I am a node')
      })

      it('path within scope, but nested', () => {
        const result = resolver.resolve(nodeBlock, 'nest/foo/bar')
        expect(result.value).to.equal('baz')
      })

      it('path out of scope', () => {
        const result = resolver.resolve(nodeBlock, 'someLink/a/b/c')
        expect(result.value).to.eql({ '/': 'LINK' })
        expect(result.remainderPath).to.equal('a/b/c')
      })
    })

    it('resolver.tree', () => {
      const paths = resolver.tree(emptyNodeBlock)
      expect(paths).to.eql([])
    })

    it.skip('resolver.patch', (done) => {})
  })

  describe('node', () => {
    describe.skip('resolver.resolve', () => {
      it('path', () => {
      })
    })

    it('resolver.tree', () => {
      const paths = resolver.tree(nodeBlock)
      expect(paths).to.eql([{
        path: 'name',
        value: 'I am a node'
      }, {
      // TODO confirm how to represent links in tree
        path: 'someLink//',
        value: 'LINK'
      }, {
        path: 'nest/foo/bar',
        value: 'baz'
      }
      // TODO fix array in .tree
      /*, {
        path: 'array/0/a',
        value: 'b'
      }, {
        path: 'array/1',
        value: '2'
      } */])
    })

    it.skip('resolver.patch', () => {})
  })
})
