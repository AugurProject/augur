(function () {
/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var augur = require("../../src/utilities").setup(require("../../src"), process.argv.slice(2));
var log = console.log;

describe("Batch", function () {

    it("batch(depositEther, reputationFaucet)", function (done) {
        var count = 0;
        var batch = augur.createBatch();
        augur.tx.depositEther.send = false;
        augur.tx.depositEther.returns = "number";
        augur.tx.depositEther.value = 1;
        augur.tx.reputationFaucet.send = false;
        augur.tx.reputationFaucet.returns = "number";
        batch.add("depositEther", [], function (r) {
            assert(r === "1" || r === "-1");
            if ((++count) === 2) done();
        });
        batch.add("reputationFaucet", [augur.branches.dev], function (r) {
            assert.strictEqual(r, "1");
            if ((++count) === 2) done();
        });
        batch.execute();
    });

    it("batch(reputationFaucet, depositEther)", function (done) {
        var count = 0;
        var batch = augur.createBatch();
        augur.tx.depositEther.send = false;
        augur.tx.depositEther.returns = "number";
        augur.tx.depositEther.value = 1;
        augur.tx.reputationFaucet.send = false;
        augur.tx.reputationFaucet.returns = "number";
        batch.add("reputationFaucet", [augur.branches.dev], function (r) {
            assert.strictEqual(r, "1");
            if ((++count) === 2) done();
        });
        batch.add("depositEther", [], function (r) {
            assert(r === "1" || r === "-1");
            if ((++count) === 2) done();
        });
        batch.execute();
    });

});

})();
