js-ipld
=======

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://ipn.io) [![](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://ipfs.io/) [![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs) [![Dependency Status](https://david-dm.org/diasdavid/js-ipld.svg?style=flat-square)](https://david-dm.org/diasdavid/js-ipld)
[![Travis CI](https://travis-ci.org/diasdavid/js-ipld.svg?branch=master)](https://travis-ci.org/diasdavid/js-ipld)

> JavaScript implementation of the [IPLD spec](https://github.com/ipfs/specs/blob/master/merkledag/ipld.md).

## Installation

### Node.js

```bash
$ npm i --save ipld
```


## Usage

```js
const ipld = require('ipld')

const file = {
  name: 'hello.txt',
  size: 11
}

// CBOR encoded Buffer
const marshalled = ipld.marshal(file)

console.log(ipld.multihash(marshalled))
// => QmQtX5JVbRa25LmQ1LHFChkXWW5GaWrp7JpymN4oPuBSmL

// Convert CBOR object to JavaScript object
console.log(ipld.unmarshal(marshalled) === file)
// => true
```
