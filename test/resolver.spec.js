/* eslint max-nested-callbacks: ["error", 8] */
/* eslint-env mocha */
'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)

const waterfall = require('async/waterfall')
const parallel = require('async/parallel')
const CID = require('cids')

const dagCBOR = require('../src')
const resolver = dagCBOR.resolver

describe('IPLD format resolver (local)', () => {
  let emptyNodeBlob
  let nodeBlob

  before((done) => {
    const emptyNode = {}
    const node = {
      name: 'I am a node',
      someLink: {
        '/': 'QmaNh5d3hFiqJAGjHmvxihSnWDGqYZCn7H2XHpbttYjCNE'
      },
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

    waterfall([
      (cb) => parallel([
        (cb) => dagCBOR.util.serialize(emptyNode, cb),
        (cb) => dagCBOR.util.serialize(node, cb)
      ], cb),
      (blocks, cb) => {
        emptyNodeBlob = blocks[0]
        nodeBlob = blocks[1]
        cb()
      }
    ], done)
  })

  it('multicodec is dag-cbor', () => {
    expect(resolver.multicodec).to.equal('dag-cbor')
  })

  it('defaultHashAlg is sha2-256', () => {
    expect(resolver.defaultHashAlg).to.equal('sha2-256')
  })

  describe('empty node', () => {
    describe('resolver.resolve', () => {
      it('root', (done) => {
        resolver.resolve(emptyNodeBlob, '/', (err, result) => {
          expect(err).to.not.exist()
          expect(result.value).to.be.eql({})
          done()
        })
      })
    })

    it('resolver.tree', (done) => {
      resolver.tree(emptyNodeBlob, (err, paths) => {
        expect(err).to.not.exist()
        expect(paths).to.eql([])
        done()
      })
    })
  })

  describe('node', () => {
    it('resolver.tree', (done) => {
      resolver.tree(nodeBlob, (err, paths) => {
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
      resolver.isLink(nodeBlob, 'someLink', (err, link) => {
        expect(err).to.not.exist()
        expect(CID.isCID(link)).to.equal(true)
        done()
      })
    })

    it('resolver.isLink with invalid Link', (done) => {
      resolver.isLink(nodeBlob, '', (err, link) => {
        expect(err).to.not.exist()
        expect(link).to.equal(false)
        done()
      })
    })

    describe('resolver.resolve', () => {
      it('path within scope', (done) => {
        resolver.resolve(nodeBlob, 'name', (err, result) => {
          expect(err).to.not.exist()
          expect(result.value).to.equal('I am a node')
          done()
        })
      })

      it('path within scope, but nested', (done) => {
        resolver.resolve(nodeBlob, 'nest/foo/bar', (err, result) => {
          expect(err).to.not.exist()
          expect(result.value).to.equal('baz')
          done()
        })
      })

      it('path out of scope', (done) => {
        resolver.resolve(nodeBlob, 'someLink/a/b/c', (err, result) => {
          expect(err).to.not.exist()
          expect(result.value).to.eql(new CID('QmaNh5d3hFiqJAGjHmvxihSnWDGqYZCn7H2XHpbttYjCNE'))
          expect(result.remainderPath).to.equal('a/b/c')
          done()
        })
      })
    })
  })
})
