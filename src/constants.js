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
        // event log_price(market:indexed, type, price, amount, timestamp, outcome, trader:indexed)
        log_price: "log_price(int256,int256,int256,int256,int256,int256,int256)",
        
        // event log_add_tx(market:indexed, sender, type, price, amount, outcome, tradeid)
        log_add_tx: "log_add_tx(int256,int256,int256,int256,int256,int256,int256)",
        
        // event log_fill_tx(market:indexed, sender:indexed, owner:indexed, type, price, amount, tradeid, outcome)
        log_fill_tx: "log_fill_fx(int256,int256,int256,int256,int256,int256,int256,int256)",
        
        // event log_cancel(market:indexed, sender, price, amount, tradeid, outcome, type)
        log_cancel: "log_cancel(int256,int256,int256,int256,int256,int256,int256)"
    }
};
