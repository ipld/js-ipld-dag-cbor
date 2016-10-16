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
      it.skip('path', () => {
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
