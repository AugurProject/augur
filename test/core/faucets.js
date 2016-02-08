"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));

var payment_value = 1;
var branch = augur.branches.dev;
var coinbase = augur.coinbase;

describe("Faucets", function () {

    it("reputationFaucet", function (done) {
        this.timeout(augur.constants.TIMEOUT);
        augur.reputationFaucet(
            augur.branches.dev,
            function (r) {
                // sent
                assert.strictEqual(r.callReturn, "1");
                assert(abi.bignum(r.txHash).toNumber());
            },
            function (r) {
                // success
                assert.strictEqual(r.callReturn, "1");
                assert.notStrictEqual(abi.bignum(r.blockHash).toNumber(), 0);
                assert.isAbove(abi.number(r.blockNumber), 0);
                var rep_balance = augur.getRepBalance(augur.branches.dev, augur.coinbase);
                var cash_balance = augur.getCashBalance(augur.coinbase);
                assert.strictEqual(rep_balance, "47");
                done();
            },
            // failed
            done
        );
    });
});

describe("Cash deposit", function () {

    var value = augur.constants.FREEBIE * 0.25;
    var weiValue = abi.bignum(value).mul(augur.constants.ETHER).toFixed();
    var initialCash = abi.bignum(augur.getCashBalance(augur.coinbase));

    it("deposit", function (done) {
        this.timeout(augur.constants.TIMEOUT*2);
        augur.sendCash({
            to: augur.tx.sendCash,
            value: 0,
            onSent: function (res) {
                assert(res.txHash);
                assert.strictEqual(res.callReturn, "0");
            },
            onSuccess: function (res) {
                assert(res.txHash);
                assert.strictEqual(res.callReturn, "0");
                augur.depositEther({
                    value: value,
                    onSent: function (res) {
                        assert.strictEqual(res.txHash.length, 66);
                        assert.strictEqual(weiValue, res.callReturn);
                    },
                    onSuccess: function (res) {
                        assert.strictEqual(res.txHash.length, 66);
                        assert.strictEqual(weiValue, res.callReturn);
                        assert.strictEqual(res.from, augur.coinbase);
                        assert.strictEqual(res.to, augur.contracts.cash);
                        var afterCash = abi.bignum(augur.getCashBalance(augur.coinbase));
                        assert.strictEqual(afterCash.sub(initialCash).toNumber(), value);
                        done();
                    },
                    onFailed: done
                });
            },
            onFailed: done
        });
    });
});
