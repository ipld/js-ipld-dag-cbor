'use strict'

exports = module.exports

exports.multicodec = 'dag-cbor'

/*
 * resolve: receives a path and a block and returns the value on path,
 * throw if not possible. `block` is an IPFS Block instance (contains data+key)
 */
exports.resolve = (block, path) => {
}

/*
 * tree: returns a flattened array with paths: values of the project. options
 * are option (i.e. nestness)
 */
exports.tree = (block, options) => {
  if (!options) {
    options = {}
  }
}

// TODO recheck this API
/*
 * patch: modifies or adds value on path, yields a new block with that change
 */
exports.patch = (block, path, value) => {}
