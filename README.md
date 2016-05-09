Augur
=====

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

Visit [http://localhost](http://localhost)

Documentation
-------------

[http://docs.augur.net](http://docs.augur.net)