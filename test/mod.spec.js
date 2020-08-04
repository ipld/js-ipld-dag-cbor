/* eslint-env mocha */
'use strict'

const { expect } = require('aegir/utils/chai')
const multicodec = require('multicodec')
const mod = require('../src')

describe('IPLD Format', () => {
  it('codec is dag-cbor', () => {
    expect(mod.codec).to.equal(multicodec.DAG_CBOR)
  })

  it('defaultHashAlg is sha2-256', () => {
    expect(mod.defaultHashAlg).to.equal(multicodec.SHA2_256)
  })
})
