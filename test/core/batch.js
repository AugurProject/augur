/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var tools = require("../tools");
var augur = tools.setup(require("../../src"), process.argv.slice(2));

var wsUrl = augur.rpc.wsUrl;
augur.rpc.wsUrl = null;

describe("Batch", function () {

    if (!process.env.AUGURJS_INTEGRATION_TESTS) return;

    it("batch(fundNewAccount, reputationFaucet)", function (done) {
        this.timeout(tools.TIMEOUT);
        var count = 0;
        augur.rpc.debug.broadcast=true;
        var batch = augur.createBatch();
        batch.add("Cash", "balance", [augur.from], function (r) {
            console.log("got:", r);
            assert(r === "1" || r === "-1");
            if ((++count) === 2) done();
        });
        batch.add("Reporting", "getRepBalance", [augur.constants.DEFAULT_BRANCH_ID, augur.from], function (r) {
            console.log("added;", r);
            assert.strictEqual(r, "1");
            if ((++count) === 2) done();
        });
        console.log("batch:", JSON.stringify(batch.txlist, null, 2));
        batch.execute();
    });

    it("batch(reputationFaucet, fundNewAccount)", function (done) {
        this.timeout(tools.TIMEOUT);
        var count = 0;
        var batch = augur.createBatch();
        augur.tx.Cash.fundNewAccount.send = false;
        augur.tx.Cash.fundNewAccount.returns = "number";
        augur.tx.Cash.fundNewAccount.value = 1;
        augur.tx.Faucets.reputationFaucet.send = false;
        augur.tx.Faucets.reputationFaucet.returns = "number";
        batch.add("Faucets", "reputationFaucet", [augur.constants.DEFAULT_BRANCH_ID], function (r) {
            assert.strictEqual(r, "1");
            if ((++count) === 2) done();
        });
        batch.add("Faucets", "fundNewAccount", [], function (r) {
            assert(r === "1" || r === "-1");
            if ((++count) === 2) done();
        });
        batch.execute();
    });

});

after(function () { augur.rpc.wsUrl = wsUrl; });
