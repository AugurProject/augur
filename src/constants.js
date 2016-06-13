/** 
 * augur.js constants
 */

"use strict";

var BigNumber = require("bignumber.js");

BigNumber.config({MODULO_MODE: BigNumber.EUCLID});

module.exports = {
    ZERO: new BigNumber(0),
    ONE: new BigNumber(2).toPower(64),
    ETHER: new BigNumber(10).toPower(18),

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
    FAUCET: "https://faucet.augur.net/faucet/",

    // event (log) signatures
    LOGS: {
        // event log_add_tx(market:indexed, sender, type, price, amount, outcome, tradeid)
        // contract: buyAndSellShares
        add_tx: "log_add_tx(int256,int256,int256,int256,int256,int256,int256)",
        
        // event log_cancel(market:indexed, sender, price, amount, tradeid, outcome, type)
        // contract: buyAndSellShares
        cancel: "log_cancel(int256,int256,int256,int256,int256,int256,int256)",

        // event thru(user:indexed, time)
        // contract: closeMarket
        thru: "thru(int256,int256)",

        // event penalize(user:indexed, outcome, oldrep, repchange, newafterrep, p, reportValue)
        // contract: consensus
        penalize: "penalize(int256,int256,int256,int256,int256,int256,int256)",

        // event Transfer(_from:indexed, _to:indexed, _value)
        // contract: sendReputation
        transfer: "Transfer(int256,int256,int256)",

        // event Approval(_owner:indexed, _spender:indexed, value)
        // contract: sendReputation
        approval: "Approval(int256,int256,int256)",

        // event log_price(market:indexed, type, price, amount, timestamp, outcome, trader:indexed)
        // contract: trade
        price: "log_price(int256,int256,int256,int256,int256,int256,int256)",
        
        // event log_fill_tx(market:indexed, sender:indexed, owner:indexed, type, price, amount, tradeid, outcome)
        // contract: trade
        fill_tx: "log_fill_tx(int256,int256,int256,int256,int256,int256,int256,int256)"
    }
};
