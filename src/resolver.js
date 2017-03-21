'use strict'

const util = require('./util')
const traverse = require('traverse')

exports = module.exports

exports.multicodec = 'dag-cbor'

/*
 * resolve: receives a path and a block and returns the value on path,
 * throw if not possible. `block` is an IPFS Block instance (contains data + cid)
 */
exports.resolve = (block, path, callback) => {
  if (typeof path === 'function') {
    callback = path
    path = undefined
  }

  util.deserialize(block.data, (err, node) => {
    if (err) {
      return callback(err)
    }

    // root

    if (!path || path === '/') {
      return callback(null, {
        value: node,
        remainderPath: ''
      })
    }

    // within scope

    // const tree = exports.tree(block)
    const parts = path.split('/')
    const val = traverse(node).get(parts)

    if (val) {
      return callback(null, {
        value: val,
        remainderPath: ''
      })
    }

    // out of scope
    let value
    let len = parts.length

    for (let i = 0; i < len; i++) {
      const partialPath = parts.shift()

      if (Array.isArray(node) && !Buffer.isBuffer(node)) {
        value = node[Number(partialPath)]
      } if (node[partialPath]) {
        value = node[partialPath]
      } else {
        // can't traverse more
        if (!value) {
          return callback(new Error('path not available at root'))
        } else {
          parts.unshift(partialPath)
          return callback(null, {
            value: value,
            remainderPath: parts.join('/')
          })
        }
      }
      node = value
    }
  })
}

function flattenObject (obj, delimiter) {
  delimiter = delimiter || '/'

  if (Object.keys(obj).length === 0) {
    return []
  }

  return traverse(obj).reduce(function (acc, x) {
    if (typeof x === 'object' && x['/']) {
      this.update(undefined)
    }
    const path = this.path.join(delimiter)

    if (path !== '') {
      acc.push({ path: path, value: x })
    }
    return acc
  }, [])
}

/*
 * tree: returns a flattened array with paths: values of the project. options
 * are option (i.e. nestness)
 */
exports.tree = (block, options, callback) => {
  if (typeof options === 'function') {
    callback = options
    options = undefined
  }

  options = options || {}

  util.deserialize(block.data, (err, node) => {
    if (err) {
      return callback(err)
    }
    const flat = flattenObject(node)
    const paths = flat.map((el) => el.path)

    callback(null, paths)
  })
}

exports.isLink = (block, path, callback) => {
  exports.resolve(block, path, (err, result) => {
    if (err) {
      return callback(err)
    }

    if (result.remainderPath.length > 0) {
      return callback(new Error('path out of scope'))
    }

    if (typeof result.value === 'object' && result.value['/']) {
      callback(null, result.value)
    } else {
      callback(null, false)
    }
  })
}
