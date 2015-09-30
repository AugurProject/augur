(function () {
/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var augur = require("../../src/utilities").setup(require("../../src"), process.argv.slice(2));
var log = console.log;

describe("Batch", function () {

    it("batch(cashFaucet, reputationFaucet)", function (done) {
        var count = 0;
        var batch = augur.createBatch();
        augur.tx.cashFaucet.send = false;
        augur.tx.cashFaucet.returns = "number";
        augur.tx.reputationFaucet.send = false;
        augur.tx.reputationFaucet.returns = "number";
        batch.add("cashFaucet", [], function (r) {
            assert(r === "1" || r === "-1");
            if ((++count) === 2) done();
        });
        batch.add("reputationFaucet", [augur.branches.dev], function (r) {
            assert.strictEqual(r, "1");
            if ((++count) === 2) done();
        });
        batch.execute();
    });

    it("batch(reputationFaucet, cashFaucet)", function (done) {
        var count = 0;
        var batch = augur.createBatch();
        augur.tx.cashFaucet.send = false;
        augur.tx.cashFaucet.returns = "number";
        augur.tx.reputationFaucet.send = false;
        augur.tx.reputationFaucet.returns = "number";
        batch.add("reputationFaucet", [augur.branches.dev], function (r) {
            assert.strictEqual(r, "1");
            if ((++count) === 2) done();
        });
        batch.add("cashFaucet", [], function (r) {
            assert(r === "1" || r === "-1");
            if ((++count) === 2) done();
        });
        batch.execute();
    });

});

})();
