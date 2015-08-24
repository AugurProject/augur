/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var augur = require("../../src/utilities").setup(require("../../src"), process.argv.slice(2));
var log = console.log;

describe("Batch RPC", function () {

    describe("batch(cashFaucet, reputationFaucet)", function () {

        it("async: callback tx property (order 1)", function (done) {
            var batch = augur.createBatch();
            augur.tx.cashFaucet.send = false;
            augur.tx.cashFaucet.returns = "number";
            augur.tx.reputationFaucet.send = false;
            augur.tx.reputationFaucet.returns = "number";
            batch.add("cashFaucet", [], function (r) {
                assert(r === "1" || r === "-1");
                done();
            });
            batch.add("reputationFaucet", [augur.branches.dev], function (r) {
                assert.strictEqual(r, "1");
            });
            batch.execute();
        });

        it("async: callback tx property (order 2)", function (done) {
            var batch = augur.createBatch();
            augur.tx.cashFaucet.send = false;
            augur.tx.cashFaucet.returns = "number";
            augur.tx.reputationFaucet.send = false;
            augur.tx.reputationFaucet.returns = "number";
            batch.add("reputationFaucet", [augur.branches.dev], function (r) {
                assert.strictEqual(r, "1");
            });
            batch.add("cashFaucet", [], function (r) {
                assert(r === "1" || r === "-1");
                done();
            });
            batch.execute();

        });

    });

});
