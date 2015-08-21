/** 
 * constants for augur.js unit tests
 */

"use strict";

var BigNumber = require("bignumber.js");

BigNumber.config({ MODULO_MODE: BigNumber.EUCLID });

module.exports = {

    ONE: new BigNumber(2).toPower(64),
    ETHER: new BigNumber(10).toPower(18),

    // default gas: 3.135M
    DEFAULT_GAS: "0x2fd618",

    // max number of tx verification attempts
    TX_POLL_MAX: 12,

    // comment polling interval (in milliseconds)
    COMMENT_POLL_INTERVAL: 12000,

    // transaction polling interval
    TX_POLL_INTERVAL: 12000,

    // expected block interval
    SECONDS_PER_BLOCK: 12,

    // maximum number of accounts to use for unit tests
    MAX_TEST_ACCOUNTS: 4,

    // 100 free ether for new accounts on registration
    FREEBIE: 100,

    // timeout for asynchronous unit tests
    TIMEOUT: 120000,

    KEYSIZE: 32,
    IVSIZE: 16,

    FIREBASE_URL: "https://resplendent-inferno-1997.firebaseio-demo.com/",
    
    nodes: [
        "http://eth1.augur.net", // miner:      45.33.59.27:8545
        // "http://eth2.augur.net", // prospector: 45.79.204.139:8545
        "http://eth3.augur.net", // loopy/poc9: 69.164.196.239:8545
        "http://eth4.augur.net", // singapore
        "http://eth5.augur.net"  // tokyo
    ]
};
