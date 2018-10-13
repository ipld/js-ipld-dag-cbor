/* eslint-env mocha */
'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)
const garbage = require('garbage')
const map = require('async/map')
const dagCBOR = require('../src')
const multihash = require('multihashes')
const CID = require('cids')

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

  it('.serialize and .deserialize', (done) => {
    dagCBOR.util.serialize(obj, (err, serialized) => {
      expect(err).to.not.exist()
      expect(Buffer.isBuffer(serialized)).to.equal(true)

      // Check for the tag 42
      // d8 = tag, 2a = 42
      expect(
        serialized.toString('hex').match(/d82a/g)
      ).to.have.length(4)

      dagCBOR.util.deserialize(serialized, (err, deserialized) => {
        expect(err).to.not.exist()
        expect(obj).to.eql(deserialized)
        done()
      })
    })
  })

  it('error catching', (done) => {
    const circlarObj = {}
    circlarObj.a = circlarObj
    dagCBOR.util.serialize(circlarObj, (err, serialized) => {
      expect(err).to.exist()
      expect(serialized).to.not.exist()
      done()
    })
  })

  it('.cid', (done) => {
    dagCBOR.util.cid(obj, (err, cid) => {
      expect(err).to.not.exist()
      expect(cid.version).to.equal(1)
      expect(cid.codec).to.equal('dag-cbor')
      expect(cid.multihash).to.exist()
      const mh = multihash.decode(cid.multihash)
      expect(mh.name).to.equal('sha2-256')
      done()
    })
  })

  it('.cid with hashAlg', (done) => {
    dagCBOR.util.cid(obj, { hashAlg: 'sha2-512' }, (err, cid) => {
      expect(err).to.not.exist()
      expect(cid.version).to.equal(1)
      expect(cid.codec).to.equal('dag-cbor')
      expect(cid.multihash).to.exist()
      const mh = multihash.decode(cid.multihash)
      expect(mh.name).to.equal('sha2-512')
      expect(mh.length).to.equal(64)
      done()
    })
  })

  it('.cid with hashAlg and hashLen', (done) => {
    dagCBOR.util.cid(obj, { hashAlg: 'keccak-256', hashLen: 28 }, (err, cid) => {
      expect(err).to.not.exist()
      expect(cid.version).to.equal(1)
      expect(cid.codec).to.equal('dag-cbor')
      expect(cid.multihash).to.exist()
      const mh = multihash.decode(cid.multihash)
      expect(mh.name).to.equal('keccak-256')
      expect(mh.length).to.equal(28)
      // The CID must be 32 bytes including 4 bytes for
      // <cid-version><multicodec><hash-function><digest-size>
      expect(cid.buffer.length).to.equal(32)
      expect(cid.toBaseEncodedString()).to.equal('z6dSUELEcAsg5oXs7gsv42rYfczTLizSBTpGUa5M3bxe')
      done()
    })
  })

  it('strings', (done) => {
    dagCBOR.util.cid('some test string', (err, cid) => {
      expect(err).to.not.exist()
      expect(cid.version).to.equal(1)
      expect(cid.codec).to.equal('dag-cbor')
      expect(cid.multihash).to.exist()
      done()
    })
  })

  it.skip('serialize and deserialize - garbage', (done) => {
    const inputs = []

    for (let i = 0; i < 1000; i++) {
      inputs.push({ in: garbage(100) })
    }

    map(inputs, (input, cb) => {
      dagCBOR.util.serialize(input, cb)
    }, (err, encoded) => {
      if (err) {
        return done(err)
      }
      map(encoded, (enc, cb) => {
        dagCBOR.util.deserialize(enc, cb)
      }, (err, out) => {
        if (err) {
          return done(err)
        }

        expect(inputs).to.eql(out)
        done()
      })
    })
  })
})
