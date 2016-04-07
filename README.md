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

### IPLD Objects

```js
const IPLD = requrie('ipld').IPLD

const simple = new IPLD({
  name: 'hello.txt',
  size: 11
})

console.log(simple.hash)
// => QmQtX5JVbRa25LmQ1LHFChkXWW5GaWrp7JpymN4oPuBSmL

console.log(simple.resolve('size'))
// => 11
```

#### Marshal and Unmarshal

```js
const ipld = require('ipld')

const encoded = ipld.marshal(obj) // returns Buffer with CBOR encoded obj
const decoded = ipld.unmarshal(encoded)
```
