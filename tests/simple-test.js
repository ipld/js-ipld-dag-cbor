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

  test('create a MerkleDAG none', function (done) {
    var node = {
      data: new Buffer('aaaah the data!'),
      mlink: null
    }

    jsonld.compact(node, ipld.context.merkleweb, function (err, compacted) {
      expect(err).to.equal(null)
      console.log(compacted)
      done()
    })
  })
})
