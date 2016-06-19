/** 
 * augur.js constants
 */

"use strict";

var BigNumber = require("bignumber.js");
var abi = require("augur-abi");

BigNumber.config({MODULO_MODE: BigNumber.EUCLID});

module.exports = {
    ZERO: new BigNumber(0),
    ONE: new BigNumber(2).toPower(64),
    ETHER: new BigNumber(10).toPower(18),

    DEFAULT_BRANCH_ID: "0xf69b5",

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
        add_tx: {
            signature: abi.prefix_hex(abi.keccak_256("log_add_tx(int256,int256,int256,int256,int256,int256,int256)")),
            contract: "buyAndSellShares"
        },
        
        // event log_cancel(market:indexed, sender, price, amount, tradeid, outcome, type)
        cancel: {
            signature: abi.prefix_hex(abi.keccak_256("log_cancel(int256,int256,int256,int256,int256,int256,int256)")),
            contract: "buyAndSellShares"
        },

        // event thru(user:indexed, time)
        thru: {
            signature: abi.prefix_hex(abi.keccak_256("thru(int256,int256)")),
            contract: "closeMarket"
        },

        // event penalize(user:indexed, outcome, oldrep, repchange, newafterrep, p, reportValue)
        penalize: {
            signature: abi.prefix_hex(abi.keccak_256("penalize(int256,int256,int256,int256,int256,int256,int256)")),
            contract: "consensus"
        },

        // event marketCreated(marketID)
        marketCreated: {
            signature: abi.prefix_hex(abi.keccak_256("marketCreated(int256)")),
            contract: "createMarket"
        },

        // event tradingFeeUpdated(marketID, tradingFee)
        tradingFeeUpdated: {
            signature: abi.prefix_hex(abi.keccak_256("tradingFeeUpdated(int256,int256)")),
            contract: "createMarket"
        },

        // event Approval(_owner:indexed, _spender:indexed, value)
        approval: {
            signature: abi.prefix_hex(abi.keccak_256("Approval(int256,int256,int256)")),
            contract: "sendReputation"
        },

        // event Transfer(_from:indexed, _to:indexed, _value)
        transfer: {
            signature: abi.prefix_hex(abi.keccak_256("Transfer(int256,int256,int256)")),
            contract: "sendReputation"
        },

        // event log_fill_tx(market:indexed, sender:indexed, owner:indexed, type, price, amount, tradeid, outcome)
        fill_tx: {
            signature: abi.prefix_hex(abi.keccak_256("log_fill_tx(int256,int256,int256,int256,int256,int256,int256,int256)")),
            contract: "trade"
        },

        // event log_price(market:indexed, type, price, amount, timestamp, outcome, trader:indexed)
        price: {
            signature: abi.prefix_hex(abi.keccak_256("log_price(int256,int256,int256,int256,int256,int256,int256)")),
            contract: "trade"
        }
    }
};
