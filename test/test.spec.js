 /* eslint-env mocha */
'use strict'

var expect = require('chai').expect
var ipld = require('../src')

describe('IPLD Tests', (done) => {
  it('add the mlink as context a json blob', function (done) {
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

  it('expand', function (done) {
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

  it('expand with buffer as val', function (done) {
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

  it('expand nested', function (done) {
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

  it('marshel and unmarshal', function (done) {
    var node = {
      data: 'aaah the data',
      mlink: 'GIMETHEHASSSSSH'
    }

    node['@context'] = ipld.context.merkleweb

    ipld.unmarshalAsync(ipld.marshal(node), function (err, result) {
      expect(err).to.equal(null)
      var expected = {
        data: 'aaah the data',
        'http://merkle-link': 'GIMETHEHASSSSSH'
      }

      expect(ipld.expand(result[0])).to.deep.equal(expected)
      done()
    })
  })

  it('marshel and unmarshal Sync', function (done) {
    var node = {
      data: 'aaah the data',
      mlink: 'GIMETHEHASSSSSH'
    }

    node['@context'] = ipld.context.merkleweb

    var result = ipld.unmarshal(ipld.marshal(node))

    var expected = {
      data: 'aaah the data',
      'http://merkle-link': 'GIMETHEHASSSSSH'
    }

    expect(ipld.expand(result)).to.deep.equal(expected)
    done()
  })
})
