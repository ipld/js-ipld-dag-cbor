/* eslint-env mocha */
'use strict'

var expect = require('chai').expect
var IPLD = require('../src').IPLD

describe('IPLD', () => {
  it('constructor', () => {
    var file = new IPLD({
      name: 'hello.txt',
      size: 11
    })

    expect(
      file.unmarshal()
    ).to.be.eql({
      name: 'hello.txt',
      size: 11
    })
  })

  describe('resolve', () => {
    it('simple', () => {
      var file = new IPLD({
        name: 'hello.txt',
        size: 11,
        data: {
          hello: 'world'
        }
      })

      expect(
        file.resolve('data/hello')
      ).to.be.eql(
        'world'
      )
    })
  })

  it('hash', () => {
    var file = new IPLD({
      name: 'hello.txt',
      size: 11
    })

    expect(
      file.hash
    ).to.be.eql(
      'QmQtX5JVbRa25LmQ1LHFChkXWW5GaWrp7JpymN4oPuBSmL'
    )
  })
})
