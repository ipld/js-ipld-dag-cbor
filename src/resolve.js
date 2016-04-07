'use strict'

function access (obj, parts) {
  if (parts.length === 0) return obj

  return access(obj[parts.shift()], parts)
}

exports = module.exports = function resolve (obj, path) {
  if (obj.unmarshal && typeof obj.unmarshal === 'function') {
    // Handle IPLD like objects
    obj = obj.unmarshal()
  }

  const parts = path.split('/')

  return access(obj, parts)
}
