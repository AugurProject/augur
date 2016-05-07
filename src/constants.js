/** 
 * augur.js constants
 */

"use strict";

var BigNumber = require("bignumber.js");

BigNumber.config({MODULO_MODE: BigNumber.EUCLID});

module.exports = {

    ONE: new BigNumber(2).toPower(64),
    ETHER: new BigNumber(10).toPower(18),

    // default gas: 3.135M
    DEFAULT_GAS: "0x2fd618",

    // expected block interval
    SECONDS_PER_BLOCK: 12,

    KDF: "pbkdf2",
    SCRYPT: "scrypt",
    ROUNDS: 65536,
    KEYSIZE: 32,
    IVSIZE: 16,

    FAUCET: "https://faucet.augur.net/faucet/",
    LOGS: {
        updatePrice: "updatePrice(int256,int256,int256,int256,int256,int256)"
    }
};
