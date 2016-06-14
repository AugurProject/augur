"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var augur = require("../../src");
var runner = require("../runner");
var tools = require("../tools");

describe("Unit tests", function () {
    runner("eth_sendTransaction", [{
        method: "reputationFaucet",
        parameters: ["hash"]
    }, {
        method: "cashFaucet",
        parameters: []
    }, {
        method: "fundNewAccount",
        parameters: ["hash"]
    }]);
});

if (process.env.AUGURJS_INTEGRATION_TESTS) {

    describe("Integration tests", function () {

        var augur = tools.setup(require("../../src"), process.argv.slice(2));

        it("cashFaucet", function (done) {
            this.timeout(tools.TIMEOUT);
            augur.cashFaucet({
                onSent: function (r) {
                    assert(abi.bignum(r.txHash).toNumber());
                },
                onSuccess: function (r) {
                    assert.notStrictEqual(abi.bignum(r.blockHash).toNumber(), 0);
                    assert.isAbove(abi.number(r.blockNumber), 0);
                    done();
                },
                onFailed: done
            );
        });

        it("reputationFaucet", function (done) {
            this.timeout(tools.TIMEOUT);
            augur.reputationFaucet({
                branch: augur.branches.dev,
                onSent: function (r) {
                    assert.strictEqual(r.callReturn, "1");
                    assert(abi.bignum(r.txHash).toNumber());
                },
                onSuccess: function (r) {
                    assert.strictEqual(r.callReturn, "1");
                    assert.notStrictEqual(abi.bignum(r.blockHash).toNumber(), 0);
                    assert.isAbove(abi.number(r.blockNumber), 0);
                    var rep_balance = augur.getRepBalance(augur.branches.dev, augur.coinbase);
                    assert.strictEqual(rep_balance, "47");
                    done();
                },
                onFailed: done
            });
        });
    });
}
