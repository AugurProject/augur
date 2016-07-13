/** 
 * augur.js constants
 */

"use strict";

var BigNumber = require("bignumber.js");
var abi = require("augur-abi");

BigNumber.config({MODULO_MODE: BigNumber.EUCLID});

var ONE = new BigNumber(10).toPower(18); 

module.exports = {
    ZERO: new BigNumber(0),
    ONE: ONE,
    ETHER: ONE,

    DEFAULT_BRANCH_ID: "0xf69b5",
    BID: 1,
    ASK: 2,

    // default gas: 3.135M
    DEFAULT_GAS: "0x2fd618",

    // expected block interval
    SECONDS_PER_BLOCK: 12,

    // keythereum crypto parameters
    KDF: "pbkdf2",
    SCRYPT: "scrypt",
    ROUNDS: 65536,
    KEYSIZE: 32,
    IVSIZE: 16,

    // Morden testnet faucet endpoint
    FAUCET: "https://faucet.augur.net/faucet/"
};
