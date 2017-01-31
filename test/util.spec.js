/* eslint-env mocha */
'use strict'

const expect = require('chai').expect
const deepFreeze = require('deep-freeze')
const garbage = require('garbage')
const map = require('async/map')
const dagCBOR = require('../src')

describe('util', () => {
  const obj = {
    someKey: 'someValue',
    link: { '/': 'aaaaa' },
    links: [{'/': 1}, {'/': 2}],
    nested: {
      hello: 'world',
      link: { '/': 'mylink' }
    }
  }

  it('.serialize and .deserialize', (done) => {
    // freeze, to ensure we don't change the source objecdt
    deepFreeze(obj)
    dagCBOR.util.serialize(obj, (err, serialized) => {
      expect(err).to.not.exist
      expect(Buffer.isBuffer(serialized)).to.be.true

      // Check for the tag 42
      // d8 = tag, 2a = 42
      expect(
        serialized.toString('hex').match(/d82a/g)
      ).to.have.length(4)

      dagCBOR.util.deserialize(serialized, (err, deserialized) => {
        expect(err).to.not.exist
        expect(obj).to.eql(deserialized)
        done()
      })
    })
  })

  it('error catching', (done) => {
    const circlarObj = {}
    circlarObj.a = circlarObj
    dagCBOR.util.serialize(circlarObj, (err, serialized) => {
      expect(err).to.exist
      expect(serialized).to.not.exist
      done()
    })
  })

  it('.cid', (done) => {
    dagCBOR.util.cid(obj, (err, cid) => {
      expect(err).to.not.exist
      expect(cid.version).to.equal(1)
      expect(cid.codec).to.equal('dag-cbor')
      expect(cid.multihash).to.exist
      done()
    })
  })

  it('serialize and deserialize - garbage', (done) => {
    const inputs = []
    for (let i = 0; i < 1000; i++) {
      inputs.push({in: garbage(100)})
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

        expect(inputs).to.be.eql(out)
        done()
      })
    })
  })
})
