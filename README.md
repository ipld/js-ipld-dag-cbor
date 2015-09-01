node-ipld
=========

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://ipn.io) [![](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://ipfs.io/) [![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs)

> Node.js implementation of the IPLD spec.

# Description

# Usage

### IPLD contexts and types

```JavaScript
console.log(ipld.context)
# { merkleweb: { mlink: 'http://merkle-link' } }
console.log(ipld.type)
# { mlink: 'http://merkle-link' }
```

### expand an obj

```
var node = {
  data: 'aaah the data',
  mlink: 'QmdasdSHJKDADHAgimethehasssssh' // should be a valid IPFS hash
}

node['@context'] = ipld.context.merkleweb
console.log(ipld.expand(node))
# { data: 'aaah the data', 'http://merkle-link': 'QmdasdSHJKDADHAgimethehasssssh'}
```

### marshal and unmarshal

```
ipld.marshal(obj) // returns Buffer with CBOR encoded obj
ipld.unmarshal(buf, function (err, result) {})
```


