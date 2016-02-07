/** 
 * augur.js constants
 */

"use strict";

var Decimal = require("decimal.js");
var BigNumber = require("bignumber.js");

BigNumber.config({ MODULO_MODE: BigNumber.EUCLID });

module.exports = {

    ONE: new BigNumber(2).toPower(64),
    ETHER: new BigNumber(10).toPower(18),

    // default gas: 3.135M
    DEFAULT_GAS: "0x2fd618",

    // expected block interval
    SECONDS_PER_BLOCK: 12,

    // maximum number of accounts/samples for testing
    MAX_TEST_ACCOUNTS: 3,
    MAX_TEST_SAMPLES: 25,

    // free ether for new accounts on registration
    FREEBIE: 1337,

    // unit test timeout
    TIMEOUT: 600000,

    KDF: "pbkdf2",
    ROUNDS: 65536,
    KEYSIZE: 32,
    IVSIZE: 16,
    IPFS_LOCAL: {host: "localhost", port: "5001", protocol: "http"},
    IPFS_REMOTE: [
        {host: "ipfs1.augur.net", port: "443", protocol: "https"},
        {host: "ipfs2.augur.net", port: "443", protocol: "https"},
        {host: "ipfs4.augur.net", port: "443", protocol: "https"},
        {host: "ipfs5.augur.net", port: "443", protocol: "https"}
    ],

    // Newton's method parameters
    TOLERANCE: new Decimal("0.00000001"),
    EPSILON: new Decimal("0.0000000000001"),
    MAX_ITER: 250
};
