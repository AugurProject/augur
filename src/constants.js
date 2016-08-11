/** 
 * augur.js constants
 */

"use strict";

var BigNumber = require("bignumber.js");

BigNumber.config({MODULO_MODE: BigNumber.EUCLID});

var ONE = new BigNumber(10).toPower(18); 

module.exports = {
    ZERO: new BigNumber(0),
    ONE: ONE,
    ETHER: ONE,

    DEFAULT_BRANCH_ID: "0xf69b5",
    BID: 1,
    ASK: 2,

    // milliseconds to wait between getMarketsInfo batches
    PAUSE_BETWEEN_MARKET_BATCHES: 50,

    // fixed-point indeterminate: 1.5 * 10^18
    INDETERMINATE: "0x14d1120d7b160000",
    INDETERMINATE_PLUS_ONE: "0x14d1120d7b160001",

    // default gas: 3.135M
    DEFAULT_GAS: 3135000,

    // gas needed for trade transactions (values from pyethereum tester)
    TRADE_GAS: [
        {sell: 756374, buy: 787421}, // first trade_id only
        {sell: 615817, buy: 661894} // each additional trade_id
    ],

    // expected block interval
    SECONDS_PER_BLOCK: 12,

    // keythereum crypto parameters
    KDF: "pbkdf2",
    SCRYPT: "scrypt",
    ROUNDS: 65536,
    KEYSIZE: 32,
    IVSIZE: 16,

    // cipher used to encrypt/decrypt reports
    REPORT_CIPHER: "aes-256-ctr",

    // Morden testnet faucet endpoint
    FAUCET: "https://faucet.augur.net/faucet/"
};
