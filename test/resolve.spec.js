/* eslint-env mocha */
'use strict'

const expect = require('chai').expect

const ipld = require('../src')

describe('resolve', () => {
  it('simple', () => {
    const src = {
      data: 'hello world',
      size: 11
    }

    expect(
      ipld.resolve(src, 'size')
    ).to.be.eql(
      11
    )
  })
})
