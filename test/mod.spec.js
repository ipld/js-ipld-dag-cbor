/* eslint-env mocha */
'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)
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
