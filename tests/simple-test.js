var Lab = require('lab')
var Code = require('code')
var lab = exports.lab = Lab.script()

var experiment = lab.experiment
var test = lab.test
var expect = Code.expect

// var multihash = require('multihashing')
var ipld = require('../src')
var jsonld = require('jsonld')

experiment('JSONLD+CBOR+multihash test', function () {
//  var merkleDB = {} // simple object store for our MerkleDAG nodes

  test('jsonld example', function (done) {
    var doc = {
      'http://schema.org/name': 'Manu Sporny',
      'http://schema.org/url': {'@id': 'http://manu.sporny.org/'},
      'http://schema.org/image': {'@id': 'http://manu.sporny.org/images/manu.png'}
    }

    var context = {
      'name': 'http://schema.org/name',
      'homepage': {'@id': 'http://schema.org/url', '@type': '@id'},
      'image': {'@id': 'http://schema.org/image', '@type': '@id'}
    }

    jsonld.compact(doc, context, function (err, compacted) {
      expect(err).to.equal(null)
      console.log(compacted)
      done()
    })
  })

  test('jsonld example, but through URL', function (done) {
    var doc = {
      'http://schema.org/name': 'Manu Sporny',
      'http://schema.org/url': {'@id': 'http://manu.sporny.org/'},
      'http://schema.org/image': {'@id': 'http://manu.sporny.org/images/manu.png'}
    }

    jsonld.compact(doc, ipld.context.exampleJSONLD, function (err, compacted) {
      expect(err).to.equal(null)
      console.log(compacted)
      done()
    })
  })

  test('create a MerkleDAG none', function (done) {
    var node = {
      '@context': 'http://gateway.ipfs.io/ipfs/QmeuyZfvkugKe65pb6hHGJ9M61RAnFUoZ8PY5yhWmCo6Lq/merkleweb',
      data: new Buffer('aaaah the data!'),
      other: 'aaa',
      mlink: { '@id': 'aaa'}
    }

    /*
    var context = {
      'mlink': {
        '@id': 'http://merkle-link',
        '@type': '@id'
      }
    }
    */

    jsonld.compact(node, ipld.context.merkleweb, function (err, compacted) {
      expect(err).to.equal(null)
      console.log(compacted)
      done()
    })
  })
})
