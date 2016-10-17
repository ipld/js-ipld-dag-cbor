'use strict'

const util = require('./util')
const _times = require('lodash.times')

exports = module.exports

exports.multicodec = 'dag-cbor'

/*
 * resolve: receives a path and a block and returns the value on path,
 * throw if not possible. `block` is an IPFS Block instance (contains data + key)
 */
exports.resolve = (block, path) => {
  let node = util.deserialize(block.data)

  // root

  if (!path || path === '/') {
    return { value: node, remainderPath: '' }
  }

  // within scope

  const tree = exports.tree(block)
  let result

  tree.forEach((item) => {
    if (item.path === path) {
      result = { value: item.value, remainderPath: '' }
    }
  })

  if (result) {
    return result
  }

  // out of scope

  // TODO this was my first try at writting this out of scope traversal code,
  // it REALLY needs way more testing.
  path = path.split('/')
  let value
  let stop = false

  _times(path.length, () => {
    if (stop) {
      return
    }
    let partialPath = path.shift()

    if (Array.isArray(node) && !Buffer.isBuffer(node)) {
      value = node[Number(partialPath)]
    } if (node[partialPath]) {
      value = node[partialPath]
    } else {
      // can't traverse more
      if (!value) {
        throw new Error('path not available at root')
      } else {
        stop = true
        path.unshift(partialPath)
        result = {
          value: value,
          remainderPath: path.length > 0 ? path.join('/') : ''
        }
      }
    }
    node = value
  })

  return result
}

/*
 * tree: returns a flattened array with paths: values of the project. options
 * are option (i.e. nestness)
 */
exports.tree = (block, options) => {
  if (!options) {
    options = {}
  }

  const node = util.deserialize(block.data)
  const flatObj = flattenObject(node)
  const paths = Object.keys(flatObj)
                     .map((key) => {
                       return {
                         path: key,
                         value: flatObj[key]
                       }
                     })
  return paths
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

  let toReturn = {}
  let flatObject
  for (let i in obj) {
    if (!obj.hasOwnProperty(i)) {
      continue
    }

    if (Array.isArray(obj[i])) {
      continue
    }

    if ((typeof obj[i]) === 'object') {
      flatObject = flattenObject(obj[i])
      for (let x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) {
          continue
        }

        if (flatObject[x] && Array === flatObject.constructor) {
          continue
        }

        toReturn[i + (isNaN(x) ? delimiter + x : '')] = flatObject[x]
      }
    } else {
      toReturn[i] = obj[i]
    }
  }
  return toReturn
}
