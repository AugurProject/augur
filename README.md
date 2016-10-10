Augur
=====
[![Build Status](https://travis-ci.org/AugurProject/augur.svg?branch=master)](https://travis-ci.org/AugurProject/augur)
[![Coverage Status](https://coveralls.io/repos/github/AugurProject/augur/badge.svg?branch=master)](https://coveralls.io/github/AugurProject/augur?branch=master)

Augur is a decentralized prediction market platform built on Ethereum.
This is the reference client.
It runs locally in your browser and communicates directly with the ethereum network, without going through intermediete servers.

There are several ways to run it:

- Easiest: **visit [app.augur.net](http://app.augur.net)**
- Balanced: **one-click azure install (coming soon)**
- Best: **run ethereum locally (coming soon)**


Build From Source
----------

Install [Node.js](https://nodejs.org/), then:

```
git clone https://github.com/AugurProject/augur.git
cd augur
npm install
npm run build
```

This will create a `build` folder with all the files necessary to run the client.
Simply copy them to your web server of choice, or use the development web server described next.


Develop
-----------

```
// build and watch source for changes
npm run watch

// run local web server
npm start

```

Visit [http://localhost:8080](http://localhost:8080)

Documentation
-------------

[http://docs.augur.net](http://docs.augur.net)

Development Tips
-------------

**#1: Search the project filenames for whatever you are looking for before thinking about it too much.**

Since our code is structured in many small files that are named the same as the state/functionality they represent, rather than try to follow and reverse engineer code paths, just blindly search all filenames for whatever it is you are looking for. More often than not, you will find what you need.

Want to know where the css for pagination is? Don't bother tracing where/how they're included, just search your files for `pag` >>>and `pagination.less` will pop up.

Want to see how the login account gets updated? Search the files for `login` >>> and `update-login-account.js` will appear.
