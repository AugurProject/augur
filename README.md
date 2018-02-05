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

## Deployment

Deployment of Augur Contracts and Augur.js consists of two to three steps. For production deploys, we will not perform the market data seeding step.

1. Contract Uploading - This is handled by the deployment code within the `augur-core` npm package. The deploy process handles uploading/versioning contracts and generating deployment artifacts.
2. Install Artifacts - Here we take the generated artifacts from (1) and wrap them into an Augur.js version, along with any necessary changes to augur.js to interface with the uploaded contracts.
2. Market Data Seeding - After installing the new deployment artifacts into augur.js after step (1), this happens only on non-production deploys.

### Using `dp`

## Documentation

[http://docs.augur.net](http://docs.augur.net)
