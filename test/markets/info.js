/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var runner = require("../runner");
var tools = require("../tools");

describe("Unit tests", function () {
    describe("eth_call", function () {
        runner(this.title, [{
            method: "getCreator",
            parameters: ["address"]
        }, {
            method: "getCreationFee",
            parameters: ["address"]
        }, {
            method: "getDescription",
            parameters: ["hash"]
        }]);
    });
    describe("eth_sendTransaction", function () {
        runner(this.title, [{
            method: "setInfo",
            parameters: ["hash", "string", "address", "fixed"]
        }]);
    });
});

describe("Integration tests", function () {

    var augur = tools.setup(require("../../src"), process.argv.slice(2));
    var constants = augur.constants;
    var branch_id = augur.branches.dev;
    var branch_number = "0";
    var accounts = tools.get_test_accounts(augur, tools.MAX_TEST_ACCOUNTS);
    var test_account = accounts[0];
    var markets = augur.getMarketsInBranch(branch_id);
    var market_id = markets[0];
    var market_creator_1 = test_account;
    var market_id2 = markets[1];
    var market_creator_2 = test_account;
    var event_id = augur.getMarketEvents(market_id)[0];

    function check_account(account, test_account) {
        assert.isAbove(abi.bignum(account).toNumber(), 0);
        if (augur.rpc.nodes.local && augur.rpc.version() === "10101") {
            assert(abi.bignum(account).eq(abi.bignum(test_account)));
        }
    }

    // info.se
    describe("info.se", function () {
        describe("getCreator(" + event_id + ") [event]", function () {
            var test = function (r) {
                check_account(r, test_account);
            };
            it("sync", function () {
                test(augur.getCreator(event_id));
            });
            it("async", function (done) {
                augur.getCreator(event_id, function (r) {
                    test(r); done();
                });
            });
            it("batched-async", function (done) {
                var batch = augur.createBatch();
                batch.add("getCreator", [event_id], function (r) {
                    test(r);
                });
                batch.add("getCreator", [event_id], function (r) {
                    test(r); done();
                });
                batch.execute();
            });
        });
        describe("getCreator(" + market_id + ") [market]", function () {
            var test = function (r) {
                check_account(r, test_account);
            };
            it("sync", function () {
                test(augur.getCreator(market_id));
            });
            it("async", function (done) {
                augur.getCreator(market_id, function (r) {
                    test(r); done();
                });
            });
            it("batched-async", function (done) {
                var batch = augur.createBatch();
                batch.add("getCreator", [market_id], function (r) {
                    test(r);
                });
                batch.add("getCreator", [market_id], function (r) {
                    test(r); done();
                });
                batch.execute();
            });
        });
        describe("getCreationFee(" + event_id + ") [event]", function () {
            var test = function (r) {
                assert(Number(r) > 0);
            };
            it("sync", function () {
                test(augur.getCreationFee(event_id));
            });
            it("async", function (done) {
                augur.getCreationFee(event_id, function (r) {
                    test(r); done();
                });
            });
            it("batched-async", function (done) {
                var batch = augur.createBatch();
                batch.add("getCreationFee", [event_id], function (r) {
                    test(r);
                });
                batch.add("getCreationFee", [event_id], function (r) {
                    test(r); done();
                });
                batch.execute();
            });
        });
        describe("getCreationFee(" + market_id + ") [market]", function () {
            var test = function (r) {
                assert(Number(r) > 0);
            };
            it("sync", function () {
                test(augur.getCreationFee(market_id));
            });
            it("async", function (done) {
                augur.getCreationFee(market_id, function (r) {
                    test(r); done();
                });
            });
            it("batched-async", function (done) {
                var batch = augur.createBatch();
                batch.add("getCreationFee", [market_id], function (r) {
                    test(r);
                });
                batch.add("getCreationFee", [market_id], function (r) {
                    test(r); done();
                });
                batch.execute();
            });
        });
        describe("getDescription(" + event_id + ")", function () {
            var test = function (r) {
                assert.isAbove(r.length, 0);
            };
            it("sync", function () {
                test(augur.getDescription(event_id));
            });
            it("async", function (done) {
                augur.getDescription(event_id, function (r) {
                    test(r); done();
                });
            });
            it("batched-async", function (done) {
                var batch = augur.createBatch();
                batch.add("getDescription", [event_id], function (r) {
                    test(r);
                });
                batch.add("getDescription", [event_id], function (r) {
                    test(r); done();
                });
                batch.execute();
            });
        });
    });

});
