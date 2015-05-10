GLOBAL.BigNumber = require('bignumber.js');
GLOBAL.keccak_256 = require('js-sha3').keccak_256;
GLOBAL.XHR2 = require('xhr2');
GLOBAL.httpsync = require('http-sync');
GLOBAL.crypto = require('crypto');
GLOBAL._ = require('lodash');
GLOBAL.Augur = require('./augur');
GLOBAL.constants = require('./test/constants');
GLOBAL.rpc = {
    protocol: "http",
    host: "localhost",
    port: 8545
};
