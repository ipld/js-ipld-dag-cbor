/* eslint-env mocha */
'use strict'

var expect = require('chai').expect
var ipld = require('../src')

describe('ipld', () => {
  it('add the mlink as context a json blob', () => {
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

    expect(node).to.be.eql(expected)
  })

  it('expand', () => {
    var node = {
      data: 'aaah the data',
      mlink: 'GIMETHEHASSSSSH'
    }

    node['@context'] = ipld.context.merkleweb

    var expected = {
      data: 'aaah the data',
      'http://merkle-link': 'GIMETHEHASSSSSH'
    }

    expect(ipld.expand(node)).to.be.eql(expected)
  })

  it('expand with buffer as val', () => {
    var node = {
      data: 'aaah the data',
      mlink: new Buffer('GIVEMETHEHASH')
    }

    node['@context'] = ipld.context.merkleweb

    var expected = {
      data: 'aaah the data',
      'http://merkle-link': new Buffer('GIVEMETHEHASH')
    }

    expect(ipld.expand(node)).to.be.eql(expected)
  })

  it('expand nested', () => {
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

    expect(ipld.expand(node)).to.be.eql(expected)
  })

  it('marshal and unmarshal', (done) => {
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

      expect(ipld.expand(result[0])).to.be.eql(expected)
      done()
    })
  })

  it('marshal and unmarshal Sync', () => {
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

    expect(ipld.expand(result)).to.be.eql(expected)
  })
})
