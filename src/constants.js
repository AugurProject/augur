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

    // expected block interval
    SECONDS_PER_BLOCK: 12,

    // maximum number of accounts to use for unit tests
    MAX_TEST_ACCOUNTS: 4,

    // free ether for new accounts on registration
    FREEBIE: 100,

    // unit test timeout
    TIMEOUT: 600000,

    KEYSIZE: 32,
    IVSIZE: 16,

    IPFS_LOCAL: {host: "localhost", port: "5001", protocol: "http"},
    IPFS_REMOTE: {host: "ipfs.augur.net", port: "443", protocol: "https"},

    CHROME_ID: "odlcbngbdolepbmofbcllpldjngefaeb"
};
