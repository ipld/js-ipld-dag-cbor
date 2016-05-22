/* eslint-env mocha */
'use strict'

const expect = require('chai').expect
const cbor = require('cbor')
const Multiaddr = require('multiaddr')

const ipld = require('../src')

describe('IPLD -> CBOR', () => {
  it('no /', () => {
    const src = {
      data: 'hello world',
      size: 11
    }

    const expected = {
      data: 'hello world',
      size: 11
    }

    expect(
      ipld.marshal(src)
    ).to.be.eql(
      cbor.encode(expected)
    )
  })

  it('/, is a string', () => {
    const src = {
      data: 'hello world',
      size: 11,
      l1: {'/': 'hello-world'}
    }

    const expected = {
      data: 'hello world',
      size: 11,
      l1: new cbor.Tagged(ipld.LINK_TAG, 'hello-world')
    }

    expect(
      ipld.marshal(src)
    ).to.be.eql(
      cbor.encode(expected)
    )
  })

  it('/, is a valid multiaddress', () => {
    const addr1 = new Multiaddr('/ip4/127.0.0.1/udp/1234')
    const addr2 = new Multiaddr('/ipfs/Qmafmh1Cw3H1bwdYpaaj5AbCW4LkYyUWaM7Nykpn5NZoYL')
    const src = {
      data: 'hello world',
      size: 11,
      l1: {'/': addr1.toString()},
      l2: {'/': addr2.toString()}
    }

    const expected = {
      data: 'hello world',
      size: 11,
      l1: new cbor.Tagged(ipld.LINK_TAG, addr1.buffer),
      l2: new cbor.Tagged(ipld.LINK_TAG, addr2.buffer)
    }

    expect(
      ipld.marshal(src)
    ).to.be.eql(
      cbor.encode(expected)
    )
  })

  it('/, with properties', () => {
    const src = {
      data: 'hello world',
      size: 11,
      secret: {
        '/': 'hello-world',
        i: 'should not be here'
      }
    }

    expect(
      () => ipld.marshal(src)
    ).to.throw(
      'Links must not have siblings'
    )
  })

  it('nested /', () => {
    const src = {
      data: 'hello world',
      size: 11,
      l1: {'/': 'hello-world'},
      secret: {
        l1: {'/': 'secret-link'}
      }
    }

    const expected = {
      data: 'hello world',
      size: 11,
      l1: new cbor.Tagged(ipld.LINK_TAG, 'hello-world'),
      secret: {
        l1: new cbor.Tagged(ipld.LINK_TAG, 'secret-link')
      }
    }

    expect(
      ipld.marshal(src)
    ).to.be.eql(
      cbor.encode(expected)
    )
  })

  it('does not modify the input', () => {
    let src = {
      l1: {'/': 'hello'}
    }

    ipld.marshal(src)

    expect(src).to.be.eql({
      l1: {'/': 'hello'}
    })
  })
})

describe('CBOR -> IPLD', () => {
  it('no links', () => {
    const src = cbor.encode({
      data: 'hello world',
      size: 11
    })

    const target = {
      data: 'hello world',
      size: 11
    }

    expect(
      ipld.unmarshal(src)
    ).to.be.eql(
      target
    )
  })

  it('one link, without properties', () => {
    const src = cbor.encode({
      data: 'hello world',
      size: 11,
      nested: new cbor.Tagged(ipld.LINK_TAG, 'hello-world')
    })

    const target = {
      data: 'hello world',
      size: 11,
      nested: {
        '/': 'hello-world'
      }
    }

    expect(
      ipld.unmarshal(src)
    ).to.be.eql(
      target
    )
  })
})
