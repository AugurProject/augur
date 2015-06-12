GLOBAL.BigNumber = require('bignumber.js');
GLOBAL.keccak_256 = require('js-sha3').keccak_256;
GLOBAL.XHR2 = require('xhr2');
GLOBAL.httpsync = require('http-sync');
GLOBAL.crypto = require('crypto');
GLOBAL._ = require('lodash');
GLOBAL.moment = require('moment');
GLOBAL.Augur = require('./augur');
GLOBAL.constants = require('./test/constants');
GLOBAL.augur = Augur;
GLOBAL.log = console.log;
GLOBAL.b = Augur.branches.dev;
GLOBAL.ballot=[ 2, 1.5, 1.5, 1, 1.5, 1.5, 1 ]

Augur.connect();

GLOBAL.c = Augur.coinbase;
