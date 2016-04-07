'use strict'

const cbor = require('cbor')
const cborUtils = require('cbor/lib/utils')
const Multiaddr = require('multiaddr')
const NoFilter = require('nofilter')
const defaults = require('lodash.defaults')
const includes = require('lodash.includes')

exports = module.exports

exports.LINK_TAG = 258

exports.marshal = (input) => {
  function transform (obj) {
    const keys = Object.keys(obj)

    // Recursive transform
    keys.forEach((key) => {
      if (typeof obj[key] === 'object') {
        obj[key] = transform(obj[key])
      }
    })

    if (includes(keys, '@link')) {
      let link = obj['@link']

      // Multiaddr encoding
      if (typeof link === 'string' && isMultiaddr(link)) {
        link = new Multiaddr(link).buffer
      }

      // Remove the @link
      delete obj['@link']

      // Non empty
      if (keys.length > 1) {
        return new cbor.Tagged(exports.LINK_TAG, [
          link,
          obj
        ])
      }

      return new cbor.Tagged(exports.LINK_TAG, link)
    }

    return obj
  }

  return cbor.encode(transform(input))
}

exports.unmarshal = (input, opts) => {
  opts = defaults(opts || {}, {
    encoding: cborUtils.guessEncoding(input)
  })

  const dec = new cbor.Decoder(opts)
  const bs = new NoFilter()

  dec.pipe(bs)
  dec.end(input, opts.encoding)

  const res = bs.read()

  function transform (obj) {
    Object.keys(obj).forEach((key) => {
      const val = obj[key]
      if (val instanceof cbor.Tagged) {
        if (typeof val.value === 'string') {
          obj[key] = {
            '@link': val.value
          }
        } else {
          obj[key] = defaults({
            '@link': val.value[0]
          }, transform(val.value[1]))
        }
      } else if (typeof val === 'object') {
        obj[key] = transform(val)
      }
    })

    return obj
  }

  return transform(res)
}

function isMultiaddr (str) {
  try {
    const addr = new Multiaddr(str)
    return addr.toString() === str
  } catch (err) {
    return false
  }
}
