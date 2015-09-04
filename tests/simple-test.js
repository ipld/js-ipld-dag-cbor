var Lab = require('lab')
var Code = require('code')
var lab = exports.lab = Lab.script()

var test = lab.test
var expect = Code.expect

var ipld = require('../src')

test('add the mlink as context a json blob', function (done) {
  var node = {
    data: 'aaah the data'
  }

  node['@context'] = ipld.context.merkleweb

  var expected = {
    data: 'aaah the data',
    '@context': {
      mlink: 'http://merkle-link'
    }
  }

  expect(node).to.deep.equal(expected)
  done()
})

test('expand', function (done) {
  var node = {
    data: 'aaah the data',
    mlink: 'GIMETHEHASSSSSH'
  }

  node['@context'] = ipld.context.merkleweb

  var expected = {
    data: 'aaah the data',
    'http://merkle-link': 'GIMETHEHASSSSSH'
  }

  expect(ipld.expand(node)).to.deep.equal(expected)
  done()
})

test('expand with buffer as val', function (done) {
  var node = {
    data: 'aaah the data',
    mlink: new Buffer('GIVEMETHEHASH')
  }

  node['@context'] = ipld.context.merkleweb

  var expected = {
    data: 'aaah the data',
    'http://merkle-link': new Buffer('GIVEMETHEHASH')
  }

  expect(ipld.expand(node)).to.deep.equal(expected)
  done()
})

test('expand nested', function (done) {
  var node = {
    data: 'aaah the data',
    foo: {
      mlink: 'GIMETHEHASSSSSH'
    }
  }

  node['@context'] = ipld.context.merkleweb

  var expected = {
    data: 'aaah the data',
    foo: {
      'http://merkle-link': 'GIMETHEHASSSSSH'
    }
  }

  expect(ipld.expand(node)).to.deep.equal(expected)
  done()
})

test('marshel and unmarshal', function (done) {
  var node = {
    data: 'aaah the data',
    mlink: 'GIMETHEHASSSSSH'
  }

  node['@context'] = ipld.context.merkleweb

  ipld.unmarshal(ipld.marshal(node), function (err, result) {
    expect(err).to.equal(null)
    var expected = {
      data: 'aaah the data',
      'http://merkle-link': 'GIMETHEHASSSSSH'
    }

    expect(ipld.expand(node)).to.deep.equal(expected)
    done()
  })
})
