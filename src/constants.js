/** 
 * augur.js constants
 */

"use strict";

var BigNumber = require("bignumber.js");

BigNumber.config({ MODULO_MODE: BigNumber.EUCLID });

module.exports = {

    ONE: new BigNumber(2).toPower(64),
    ETHER: new BigNumber(10).toPower(18),

    // default gas: 3.135M
    DEFAULT_GAS: "0x2fd618",

    // comment polling interval (in milliseconds)
    COMMENT_POLL_INTERVAL: 12000,

    // expected block interval
    SECONDS_PER_BLOCK: 12,

    // maximum number of accounts to use for unit tests
    MAX_TEST_ACCOUNTS: 4,

    // 100 free ether for new accounts on registration
    FREEBIE: 100,

    // unit test timeout
    TIMEOUT: 600000,

    KEYSIZE: 32,
    IVSIZE: 16,

    FIREBASE_URL: "https://resplendent-inferno-1997.firebaseio-demo.com/"
};
