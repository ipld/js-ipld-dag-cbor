var Lab = require('lab')
var Code = require('code')
var lab = exports.lab = Lab.script()

var experiment = lab.experiment
var test = lab.test
var expect = Code.expect

// var multihash = require('multihashing')
var ipld = require('../src')

experiment('JSONLD+CBOR+multihash test', function () {
//  var merkleDB = {} // simple object store for our MerkleDAG nodes

  test('add a mlink to a json blob', function (done) {
    var node = {
      data: 'aaah the data'
    }

    ipld.addLink(node, 'random-key', new Buffer('givemethehassssh'))

    var expected = {
      data: 'aaah the data',
      'random-key': {
        '@type': 'http://merkle-link',
        '@value': new Buffer(['103', '105', '118', '101', '109', '101', '116', '104', '101', '104', '97', '115', '115', '115', '115', '104'])
      }
    }

    expect(node).to.deep.equal(expected)
    done()
  })

  test('serialize a node', function (done) {
    var node = {
      data: 'aaah the data'
    }

    ipld.addLink(node, 'random-key', new Buffer('givemethehassssh'))

    var expected = {
      data: 'aaah the data',
      'random-key': {
        '@type': 'http://merkle-link',
        '@value': new Buffer(['103', '105', '118', '101', '109', '101', '116', '104', '101', '104', '97', '115', '115', '115', '115', '104'])
      }
    }

    var serialized = ipld.marshal(node)
    ipld.unmarshal(serialized, function (err, obj) {
      expect(err).to.equal(null)
      expect(obj[0]).to.deep.equal(expected)
      done()
    })
  })

})
