/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var tools = require("../tools");
var augur = tools.setup(require("../../src"), process.argv.slice(2));

if (process.env.AUGURJS_INTEGRATION_TESTS) {

    var wsUrl = augur.rpc.wsUrl;
    augur.rpc.wsUrl = null;

    describe("Batch", function () {

        it("batch(depositEther, reputationFaucet)", function (done) {
            this.timeout(tools.TIMEOUT);
            var count = 0;
            var batch = augur.createBatch();
            augur.tx.cash.depositEther.send = false;
            augur.tx.cash.depositEther.returns = "number";
            augur.tx.cash.depositEther.value = 1;
            augur.tx.faucets.reputationFaucet.send = false;
            augur.tx.faucets.reputationFaucet.returns = "number";
            batch.add("cash", "depositEther", [], function (r) {
                assert(r === "1" || r === "-1");
                if ((++count) === 2) done();
            });
            batch.add("faucets", "reputationFaucet", [augur.constants.DEFAULT_BRANCH_ID], function (r) {
                assert.strictEqual(r, "1");
                if ((++count) === 2) done();
            });
            batch.execute();
        });

        it("batch(reputationFaucet, depositEther)", function (done) {
            this.timeout(tools.TIMEOUT);
            var count = 0;
            var batch = augur.createBatch();
            augur.tx.cash.depositEther.send = false;
            augur.tx.cash.depositEther.returns = "number";
            augur.tx.cash.depositEther.value = 1;
            augur.tx.faucets.reputationFaucet.send = false;
            augur.tx.faucets.reputationFaucet.returns = "number";
            batch.add("faucets", "reputationFaucet", [augur.constants.DEFAULT_BRANCH_ID], function (r) {
                assert.strictEqual(r, "1");
                if ((++count) === 2) done();
            });
            batch.add("cash", "depositEther", [], function (r) {
                assert(r === "1" || r === "-1");
                if ((++count) === 2) done();
            });
            batch.execute();
        });

    });

    after(function () { augur.rpc.wsUrl = wsUrl; });

}
