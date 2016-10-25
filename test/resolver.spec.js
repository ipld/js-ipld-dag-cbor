/* eslint max-nested-callbacks: ["error", 8] */
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
      it('root', (done) => {
        resolver.resolve(emptyNodeBlock, '/', (err, result) => {
          expect(err).to.not.exist
          expect(result.value).to.be.eql({})
          done()
        })
      })
    })

    it('resolver.tree', (done) => {
      resolver.tree(emptyNodeBlock, (err, paths) => {
        expect(err).to.not.exist
        expect(paths).to.eql([])
        done()
      })
    })
  })

  describe('node', () => {
    describe('resolver.resolve', () => {
      it('path within scope', (done) => {
        resolver.resolve(nodeBlock, 'name', (err, result) => {
          expect(err).to.not.exist
          expect(result.value).to.equal('I am a node')
          done()
        })
      })

      it('path within scope, but nested', (done) => {
        resolver.resolve(nodeBlock, 'nest/foo/bar', (err, result) => {
          expect(err).to.not.exist
          expect(result.value).to.equal('baz')
          done()
        })
      })

      it('path out of scope', (done) => {
        resolver.resolve(nodeBlock, 'someLink/a/b/c', (err, result) => {
          expect(err).to.not.exist
          expect(result.value).to.eql({ '/': 'LINK' })
          expect(result.remainderPath).to.equal('a/b/c')
          done()
        })
      })
    })

    it('resolver.tree', (done) => {
      resolver.tree(nodeBlock, (err, paths) => {
        expect(err).to.not.exist
        expect(paths).to.eql([{
          path: 'name',
          value: 'I am a node'
        }, {
        // TODO: confirm how to represent links in tree
          path: 'someLink//',
          value: 'LINK'
        }, {
          path: 'nest/foo/bar',
          value: 'baz'
        }, {
          path: 'array/0/a',
          value: 'b'
        }, {
          path: 'array/1',
          value: 2
        }])
        done()
      })
    })
  })
})
