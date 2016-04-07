/* eslint-env mocha */
'use strict'

var expect = require('chai').expect
var ipld = require('../src')

describe('multihash', () => {
  it('works on marshalled objects', () => {
    var file = ipld.marshal({
      name: 'hello.txt',
      size: 11
    })

    expect(
      ipld.multihash(file)
    ).to.be.eql(
      'QmQtX5JVbRa25LmQ1LHFChkXWW5GaWrp7JpymN4oPuBSmL'
    )
  })

  it('works on objects that have .marshal function', () => {
    class File {
      constructor (name, size) {
        this.name = name
        this.size = size
      }

      marshal () {
        return ipld.marshal({
          name: this.name,
          size: this.size
        })
      }
    }

    var file = new File('hello.txt', 11)

    expect(
      ipld.multihash(file)
    ).to.be.eql(
      'QmQtX5JVbRa25LmQ1LHFChkXWW5GaWrp7JpymN4oPuBSmL'
    )
  })
})
