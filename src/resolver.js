'use strict'

const util = require('./util')
const traverse = require('traverse')

exports = module.exports

exports.multicodec = 'dag-cbor'

/*
 * resolve: receives a path and a block and returns the value on path,
 * throw if not possible. `block` is an IPFS Block instance (contains data + key)
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

    // TODO this was my first try at writting this out of scope traversal code,
    // it REALLY needs way more testing.
    let value

    for (let i = 0; i < parts.length; i++) {
      let partialPath = parts.shift()

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

/*
 * tree: returns a flattened array with paths: values of the project. options
 * are option (i.e. nestness)
 */
exports.tree = (block, options, callback) => {
  if (typeof options === 'function') {
    callback = options
    options = undefined
  }

  if (!options) {
    options = {}
  }

  util.deserialize(block.data, (err, node) => {
    if (err) {
      return callback(err)
    }

    callback(null, flattenObject(node))
  })
}

// TODO recheck this API
/*
 * patch: modifies or adds value on path, yields a new block with that change
 */
exports.patch = (block, path, value) => {}

function flattenObject (obj, delimiter) {
  if (!delimiter) {
    delimiter = '/'
  }

  if (Object.keys(obj).length === 0) {
    return []
  }

  return traverse(obj).reduce(function (acc, x) {
    if (this.isLeaf) {
      acc.push({
        path: this.path.join(delimiter),
        value: x
      })
    }

    return acc
  }, [])
}
