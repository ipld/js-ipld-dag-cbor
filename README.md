js-ipld
=======

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://ipn.io)
[![](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://ipfs.io/)
[![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs)
[![Coverage Status](https://coveralls.io/repos/github/ipfs/js-ipld/badge.svg?branch=master)](https://coveralls.io/github/ipfs/js-ipld?branch=master)
[![Travis CI](https://travis-ci.org/ipfs/js-ipld.svg?branch=master)](https://travis-ci.org/ipfs/js-ipld)
[![Circle CI](https://circleci.com/gh/ipfs/js-ipld.svg?style=svg)](https://circleci.com/gh/ipfs/js-ipld)
[![Dependency Status](https://david-dm.org/ipfs/js-ipld.svg?style=flat-square)](https://david-dm.org/ipfs/js-ipld) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

> JavaScript implementation of the [IPLD spec](https://github.com/ipfs/specs/tree/master/ipld).

# Installation

## npm

```sh
> npm i ipld
```

## Use in Node.js

```js
const ipld = require('ipld')
```

## Use in a browser with browserify, webpack or any other bundler

The code published to npm that gets loaded on require is in fact a ES5 transpiled version with the right shims added. This means that you can require it and use with your favourite bundler without having to adjust asset management process.

```JavaScript
var ipld = require('ipld')
```

## Use in a browser Using a script tag

Loading this module through a script tag will make the `Unixfs` obj available in the global namespace.

```html
<script src="https://npmcdn.com/ipld/dist/index.min.js"></script>
<!-- OR -->
<script src="https://npmcdn.com/ipld/dist/index.js"></script>
```

# Usage

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
