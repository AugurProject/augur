Augur
=====

[![Build Status](https://travis-ci.org/AugurProject/augur.svg?branch=develop)](https://travis-ci.org/AugurProject/augur)
[![Coverage Status](https://coveralls.io/repos/AugurProject/augur/badge.svg?branch=develop&service=github)](https://coveralls.io/github/AugurProject/augur?branch=develop)
[![npm version](https://badge.fury.io/js/augur-client.svg)](https://badge.fury.io/js/augur-client)

This is the graphical front-end for [Augur](https://augur.net), a decentralized prediction market platform that runs on Ethereum.  Go to [augur.net](https://augur.net) to see it in action!

Documentation
-------------

[http://docs.augur.net](http://docs.augur.net)

How to run
----------

Install [Node.js](https://nodejs.org/).

```
git clone https://github.com/AugurProject/augur.git
cd augur
git checkout develop
npm install
grunt
```

Start the local web server
```
npm start
```
Development
-----------
Don't forget to build the app first (with `grunt`). To watch for changes run
```
grunt develop
```