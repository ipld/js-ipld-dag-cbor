/* eslint-env mocha */
'use strict'

const expect = require('chai').expect
const cbor = require('cbor')
const Multiaddr = require('multiaddr')

const ipld = require('../src')

describe('IPLD -> CBOR', () => {
  it('no @link', () => {
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

  it('@link, is a string', () => {
    const src = {
      data: 'hello world',
      size: 11,
      '@link': 'hello-world'
    }

    const expected = new cbor.Tagged(ipld.LINK_TAG, [
      'hello-world',
      {
        data: 'hello world',
        size: 11
      }
    ])

    expect(
      ipld.marshal(src)
    ).to.be.eql(
      cbor.encode(expected)
    )
  })

  it('@link, is a valid multiaddress', () => {
    const addr = new Multiaddr('/ip4/127.0.0.1/udp/1234')
    const src = {
      data: 'hello world',
      size: 11,
      '@link': addr.toString()
    }

    const expected = new cbor.Tagged(ipld.LINK_TAG, [
      addr.buffer,
      {
        data: 'hello world',
        size: 11
      }
    ])

    expect(
      ipld.marshal(src)
    ).to.be.eql(
      cbor.encode(expected)
    )
  })

  it('@link, with properties', () => {
    const src = {
      data: 'hello world',
      size: 11,
      secret: {
        '@link': 'hello-world',
        secret: 3
      }
    }

    const expected = {
      data: 'hello world',
      size: 11,
      secret: new cbor.Tagged(ipld.LINK_TAG, [
        'hello-world',
        {
          secret: 3
        }
      ])
    }

    expect(
      ipld.marshal(src)
    ).to.be.eql(
      cbor.encode(expected)
    )
  })

  it('nested @link', () => {
    const src = {
      data: 'hello world',
      size: 11,
      '@link': 'hello-world',
      secret: {
        '@link': 'secret-link'
      }
    }

    const expected = new cbor.Tagged(ipld.LINK_TAG, [
      'hello-world',
      {
        data: 'hello world',
        size: 11,
        secret: new cbor.Tagged(ipld.LINK_TAG, 'secret-link')
      }
    ])

    expect(
      ipld.marshal(src)
    ).to.be.eql(
      cbor.encode(expected)
    )
  })

  it('does not modify the input', () => {
    let src = {
      '@link': 'hello'
    }

    ipld.marshal(src)

    expect(src).to.be.eql({
      '@link': 'hello'
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
        '@link': 'hello-world'
      }
    }

    expect(
      ipld.unmarshal(src)
    ).to.be.eql(
      target
    )
  })

  it('one link, with properties', () => {
    const src = cbor.encode({
      data: 'hello world',
      size: 11,
      nested: new cbor.Tagged(ipld.LINK_TAG, [
        'hello-world',
        {cool: 'property'}
      ])
    })

    const target = {
      data: 'hello world',
      size: 11,
      nested: {
        '@link': 'hello-world',
        cool: 'property'
      }
    }

    expect(
      ipld.unmarshal(src)
    ).to.be.eql(
      target
    )
  })

  it('nested links, with properties', () => {
    const src = cbor.encode({
      data: 'hello world',
      size: 11,
      secret: {
        links: [
          new cbor.Tagged(ipld.LINK_TAG, 'secret-link')
        ]
      },
      nested: new cbor.Tagged(ipld.LINK_TAG, [
        'hello-world',
        {
          cool: 'property',
          ref: new cbor.Tagged(ipld.LINK_TAG, 'world')
        }
      ])
    })

    const target = {
      data: 'hello world',
      size: 11,
      secret: {
        links: [{'@link': 'secret-link'}]
      },
      nested: {
        '@link': 'hello-world',
        cool: 'property',
        ref: {'@link': 'world'}
      }
    }

    expect(
      ipld.unmarshal(src)
    ).to.be.eql(
      target
    )
  })
})
