js-ipld
=======

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://ipn.io) [![](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://ipfs.io/) [![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs) [![Dependency Status](https://david-dm.org/diasdavid/js-ipld.svg?style=flat-square)](https://david-dm.org/diasdavid/js-ipld)
[![Travis CI](https://travis-ci.org/diasdavid/js-ipld.svg?branch=master)](https://travis-ci.org/diasdavid/js-ipld)

> JavaScript implementation of the IPLD spec.

## Installation

### Node.js

```bash
$ npm i --save ipld
```


## Usage


### Marshal and Unmarshal

```js
const ipld = require('ipld')

const encoded = ipld.marshal(obj) // returns Buffer with CBOR encoded obj
const decoded = ipld.unmarshal(encoded)
```
