"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));

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
