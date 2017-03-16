/* eslint max-nested-callbacks: ["error", 8] */
/* eslint-env mocha */
'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)
const dagCBOR = require('../src')
const resolver = dagCBOR.resolver
const Block = require('ipfs-block')
const series = require('async/series')
const CID = require('cids')

describe('IPLD format resolver (local)', () => {
  let emptyNodeBlock
  let nodeBlock

  before((done) => {
    const emptyNode = {}
    const node = {
      name: 'I am a node',
      someLink: { '/': new Buffer('LINK') },
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

    series([
      (cb) => {
        dagCBOR.util.serialize(emptyNode, (err, serialized) => {
          expect(err).to.not.exist()
          emptyNodeBlock = new Block(serialized)
          cb()
        })
      },
      (cb) => {
        dagCBOR.util.serialize(node, (err, serialized) => {
          expect(err).to.not.exist()
          nodeBlock = new Block(serialized)
          cb()
        })
      }
    ], done)
  })

  it('multicodec is dag-cbor', () => {
    expect(resolver.multicodec).to.equal('dag-cbor')
  })

  describe('empty node', () => {
    describe('resolver.resolve', () => {
      it('root', (done) => {
        resolver.resolve(emptyNodeBlock, '/', (err, result) => {
          expect(err).to.not.exist()
          expect(result.value).to.be.eql({})
          done()
        })
      })
    })

    it('resolver.tree', (done) => {
      resolver.tree(emptyNodeBlock, (err, paths) => {
        expect(err).to.not.exist()
        expect(paths).to.eql([])
        done()
      })
    })
  })

  describe('node', () => {
    it('resolver.tree', (done) => {
      resolver.tree(nodeBlock, (err, paths) => {
        expect(err).to.not.exist()

        expect(paths).to.eql([
          'name',
          'nest',
          'nest/foo',
          'nest/foo/bar',
          'array',
          'array/0',
          'array/0/a',
          'array/1',
          'someLink'
        ])

        done()
      })
    })

    it('resolver.isLink with valid Link', (done) => {
      resolver.isLink(nodeBlock, '', (err, link) => {
        expect(err).to.not.exist()
        expect(CID.isCID(new CID(link['/']))).to.equal(true)
        done()
      })
    })

    it('resolver.isLink with invalid Link', (done) => {
      resolver.isLink(nodeBlock, '', (err, link) => {
        expect(err).to.not.exist()
        expect(link).to.equal(false)
        done()
      })
    })

    describe('resolver.resolve', () => {
      it('path within scope', (done) => {
        resolver.resolve(nodeBlock, 'name', (err, result) => {
          expect(err).to.not.exist()
          expect(result.value).to.equal('I am a node')
          done()
        })
      })

      it('path within scope, but nested', (done) => {
        resolver.resolve(nodeBlock, 'nest/foo/bar', (err, result) => {
          expect(err).to.not.exist()
          expect(result.value).to.equal('baz')
          done()
        })
      })

      it('path out of scope', (done) => {
        resolver.resolve(nodeBlock, 'someLink/a/b/c', (err, result) => {
          expect(err).to.not.exist()
          expect(result.value).to.eql({ '/': new Buffer('LINK') })
          expect(result.remainderPath).to.equal('a/b/c')
          done()
        })
      })
    })
  })
})
