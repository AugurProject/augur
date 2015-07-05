/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var Augur = require("../augur");
var utilities = require("./utilities");
var log = console.log;

Augur = utilities.setup(Augur, process.argv.slice(2));

describe("Batch RPC", function () {
    describe("batch(cashFaucet, reputationFaucet)", function () {
        var test = function (res) {
            assert.equal(res.constructor, Array);
            assert.equal(res.length, 2);
            assert(parseInt(res[0]) === 1 || parseInt(res[0]) === -1);
            assert(parseInt(res[1]) === 1 || parseInt(res[1]) === -1);
        };
        var tx0 = utilities.copy(Augur.tx.cashFaucet);
        var tx1 = utilities.copy(Augur.tx.reputationFaucet);
        tx0.send = false;
        tx0.returns = "number";
        tx1.send = false;
        tx1.returns = "number";
        tx1.params = Augur.branches.dev;
        var txlist = [tx0, tx1];
        it("sync: return and match separate calls", function () {
            test(Augur.batch(txlist));
        });
        it("async: callback on whole array", function (done) {
            Augur.batch(txlist, function (r) {
                test(r); done();
            });
        });
        it("async: callback tx property (order 1)", function (done) {
            var batch = Augur.createBatch();
            Augur.tx.cashFaucet.send = false;
            Augur.tx.cashFaucet.returns = "number";
            Augur.tx.reputationFaucet.send = false;
            Augur.tx.reputationFaucet.returns = "number";
            batch.add("cashFaucet", [], function (r) {
                assert(r === "1" || r === "-1");
                done();
            });
            batch.add("reputationFaucet", [Augur.branches.dev], function (r) {
                assert.equal(r, "1");
            });
            batch.execute();
        });
        it("async: callback tx property (order 2)", function (done) {
            var batch = Augur.createBatch();
            Augur.tx.cashFaucet.send = false;
            Augur.tx.cashFaucet.returns = "number";
            Augur.tx.reputationFaucet.send = false;
            Augur.tx.reputationFaucet.returns = "number";
            batch.add("reputationFaucet", [Augur.branches.dev], function (r) {
                assert.equal(r, "1");
            });
            batch.add("cashFaucet", [], function (r) {
                assert(r === "1" || r === "-1");
                done();
            });
            batch.execute();
        });
    });
});
