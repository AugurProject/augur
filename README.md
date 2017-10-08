# Augur JavaScript API

[![Build Status](https://travis-ci.org/AugurProject/augur.js.svg?branch=master)](https://travis-ci.org/AugurProject/augur.js)
[![Coverage Status](https://coveralls.io/repos/AugurProject/augur.js/badge.svg?branch=master&service=github)](https://coveralls.io/github/AugurProject/augur.js?branch=master)
[![npm version](https://badge.fury.io/js/augur.js.svg)](http://badge.fury.io/js/augur.js)

## Installation

```
npm install augur.js
```

## Usage

```javascript
var Augur = require("augur.js");
var augur = new Augur();

var ethereumNode = { http: "http://127.0.0.1:8545", ws: "ws://127.0.0.1:8546" };
var augurNode = "ws://127.0.0.1:9001";

augur.connect({ ethereumNode, augurNode }, (err) => {
  // do stuff
});
```

## Documentation

[http://docs.augur.net](http://docs.augur.net)
