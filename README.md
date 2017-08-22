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

augur.connect({ http: "https://eth9000.augur.net", ws: "wss://ws9000.augur.net" }, () => {
  // do stuff
});
```

## Documentation

[http://docs.augur.net](http://docs.augur.net)
