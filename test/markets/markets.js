/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));
var abi = require("augur-abi");
var constants = augur.constants;
var log = console.log;

var amount = "1";
var branch_id = augur.branches.dev;
var accounts = utils.get_test_accounts(augur, constants.MAX_TEST_ACCOUNTS);
var participant_number = "1";
var outcome = 1;
var markets = augur.getMarkets(branch_id);
var market_id = markets[markets.length - 1];
var event_id = augur.getMarketEvents(market_id)[0];

// markets.se
describe("markets.se", function () {
    describe("getFullMarketInfo", function () {
        var test = function (r, done) {
            // console.log(JSON.stringify(r, null, 2));
            assert.isObject(r);
            if (done) done();
        };
        it("sync", function () {
            test(augur.getFullMarketInfo(market_id));
        });
        it("async", function (done) {
            augur.getFullMarketInfo(market_id, function (info) {
                if (!info || info.error) return done(info);
                test(info, done);
            });
        });
    });
    describe("getMarketInfo(" + market_id + ")", function () {
        var test = function (r) {
            assert.isArray(r);
            assert.isAbove(r.length, 5);
            assert.isAbove(Number(r[1]), 0);
            assert.strictEqual(Number(r[3]), 2);
            assert.isAbove(Number(r[5]), 0);
        };
        it("sync", function () {
            test(augur.getMarketInfo(market_id));
        });
        it("async", function (done) {
            augur.getMarketInfo(market_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getMarketInfo", [market_id], function (r) {
                test(r);
            });
            batch.add("getMarketInfo", [market_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getSimulatedBuy(" + market_id + ", " + outcome + ", " + amount + ")", function () {
        var test = function (r) {
            assert.strictEqual(r.length, 2);
        };
        it("sync", function () {
            test(augur.getSimulatedBuy(market_id, outcome, amount));
        });
        it("async", function (done) {
            augur.getSimulatedBuy(market_id, outcome, amount, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            var params = [market_id, outcome, abi.fix(amount, "hex")];
            batch.add("getSimulatedBuy", params, function (r) {
                test(r);
            });
            batch.add("getSimulatedBuy", params, function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getSimulatedSell(" + market_id + ", " + outcome + ", " + amount + ")", function () {
        var test = function (r) {
            assert.strictEqual(r.length, 2);
        };
        it("sync", function () {
            test(augur.getSimulatedSell(market_id, outcome, amount));
        });
        it("async", function (done) {
            augur.getSimulatedSell(market_id, outcome, amount, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            var params = [market_id, outcome, abi.fix(amount, "hex")];
            batch.add("getSimulatedSell", params, function (r) {
                test(r);
            });
            batch.add("getSimulatedSell", params, function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("lsLmsr", function () {
        var test = function (r) {
            assert(abi.bignum(r).toNumber() > 0);
        };
        it("sync", function () {
            test(augur.lsLmsr(market_id));
        });
        it("async", function (done) {
            augur.lsLmsr(market_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("lsLmsr", [market_id], function (r) {
                test(r);
            });
            batch.add("lsLmsr", [market_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getMarketEvents(" + market_id + ")", function () {
        function test(r) {
            assert.isArray(r);
            assert.strictEqual(r.length, 1);
            var event = abi.bignum(r[0]);
            var eventplus = event.plus(abi.constants.MOD);
            if (eventplus.lt(abi.constants.BYTES_32)) {
                event = eventplus;
            }
            assert(event.eq(abi.bignum(event_id)));
        }
        it("sync", function () {
            test(augur.getMarketEvents(market_id));
        });
        it("async", function (done) {
            augur.getMarketEvents(market_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getMarketEvents", [market_id], function (r) {
                test(r);
            });
            batch.add("getMarketEvents", [market_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getNumEvents(" + market_id + ") === '1'", function () {
        var test = function (r) {
            assert.strictEqual(r, "1");
        };
        it("sync", function () {
            test(augur.getNumEvents(market_id));
        });
        it("async", function (done) {
            augur.getNumEvents(market_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getNumEvents", [market_id], function (r) {
                test(r);
            });
            batch.add("getNumEvents", [market_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getBranchID(" + market_id + ")", function () {
        var test = function (r) {
            assert(abi.bignum(r).eq(abi.bignum(augur.branches.dev)));
        };
        it("sync", function () {
            test(augur.getBranchID(market_id));
        });
        it("async", function (done) {
            augur.getBranchID(market_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getBranchID", [market_id], function (r) {
                test(r);
            });
            batch.add("getBranchID", [market_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getCurrentParticipantNumber(" + market_id + ") >= 0", function () {
        var test = function (r) {
            utils.gteq0(r);
        };
        it("sync", function () {
            test(augur.getCurrentParticipantNumber(market_id));
        });
        it("async", function (done) {
            augur.getCurrentParticipantNumber(market_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getCurrentParticipantNumber", [market_id], function (r) {
                test(r);
            });
            batch.add("getCurrentParticipantNumber", [market_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getMarketNumOutcomes(" + market_id + ") ", function () {
        var test = function (r) {
            assert.strictEqual(r, "2");
        };
        it("sync", function () {
            test(augur.getMarketNumOutcomes(market_id));
        });
        it("async", function (done) {
            augur.getMarketNumOutcomes(market_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getMarketNumOutcomes", [market_id], function (r) {
                test(r);
            });
            batch.add("getMarketNumOutcomes", [market_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getParticipantSharesPurchased(" + market_id + ", " + participant_number + "," + outcome + ") ", function () {
        var test = function (r) {
            utils.gteq0(r);
        };
        it("sync", function () {
            test(augur.getParticipantSharesPurchased(market_id, participant_number, outcome));
        });
        it("async", function (done) {
            augur.getParticipantSharesPurchased(market_id, participant_number, outcome, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            var params = [market_id, participant_number, outcome];
            batch.add("getParticipantSharesPurchased", params, function (r) {
                test(r);
            });
            batch.add("getParticipantSharesPurchased", params, function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getSharesPurchased(" + market_id + ", " + outcome + ") ", function () {
        var test = function (r) {
            utils.gteq0(r);
        };
        it("sync", function () {
            test(augur.getSharesPurchased(market_id, outcome));
        });
        it("async", function (done) {
            augur.getSharesPurchased(market_id, outcome, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            var params = [market_id, outcome];
            batch.add("getSharesPurchased", params, function (r) {
                test(r);
            });
            batch.add("getSharesPurchased", params, function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getWinningOutcomes(" + market_id + ")", function () {
        var test = function (r) {
            assert.strictEqual(r.constructor, Array);
        };
        it("sync", function () {
            test(augur.getWinningOutcomes(market_id));
        });
        it("async", function (done) {
            augur.getWinningOutcomes(market_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getWinningOutcomes", [market_id], function (r) {
                test(r);
            });
            batch.add("getWinningOutcomes", [market_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("price(" + market_id + ", " + outcome + ") ", function () {
        var test = function (r) {
            assert(parseFloat(r) >= 0.0);
            assert(parseFloat(r) <= 1.0);
        };
        it("sync", function () {
            test(augur.price(market_id, outcome));
        });
        it("async", function (done) {
            augur.price(market_id, outcome, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            var params = [market_id, outcome];
            batch.add("price", params, function (r) {
                test(r);
            });
            batch.add("price", params, function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getParticipantNumber(" + market_id + ", " + accounts[0] + ") ", function () {
        var test = function (r) {
            utils.gteq0(r);
        };
        it("sync", function () {
            test(augur.getParticipantNumber(market_id, accounts[0]));
        });
        it("async", function (done) {
            augur.getParticipantNumber(market_id, accounts[0], function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            var params = [market_id, accounts[0]];
            batch.add("getParticipantNumber", params, function (r) {
                test(r);
            });
            batch.add("getParticipantNumber", params, function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getParticipantID(" + market_id + ", " + participant_number + ") ", function () {
        var test = function (r) {
            assert.strictEqual(parseInt(r), 0);
        };
        it("sync", function () {
            test(augur.getParticipantID(market_id, participant_number));
        });
        it("async", function (done) {
            augur.getParticipantID(market_id, participant_number, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            var params = [market_id, participant_number];
            batch.add("getParticipantID", params, function (r) {
                test(r);
            });
            batch.add("getParticipantID", params, function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getAlpha(" + market_id + ") ", function () {
        var test = function (r) {
            assert.strictEqual(parseFloat(r).toFixed(6), "0.007900");
        };
        it("sync", function () {
            test(augur.getAlpha(market_id));
        });
        it("async", function (done) {
            augur.getAlpha(market_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getAlpha", [market_id], function (r) {
                test(r);
            });
            batch.add("getAlpha", [market_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getCumScale(" + market_id + ") ", function () {
        var test = function (r) {
            assert.strictEqual(r, "0.00000000000000000005");
        };
        it("sync", function () {
            test(augur.getCumScale(market_id));
        });
        it("async", function (done) {
            augur.getCumScale(market_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getCumScale", [market_id], function (r) {
                test(r);
            });
            batch.add("getCumScale", [market_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getTradingPeriod(" + market_id + ") ", function () {
        var test = function (r) {
            assert(parseInt(r) >= -1);
        };
        it("sync", function () {
            test(augur.getTradingPeriod(market_id));
        });
        it("async", function (done) {
            augur.getTradingPeriod(market_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getTradingPeriod", [market_id], function (r) {
                test(r);
            });
            batch.add("getTradingPeriod", [market_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getTradingFee(" + market_id + ") ", function () {
        var test = function (r) {
            assert.strictEqual(r, "0.01999999999999999998");
        };
        it("sync", function () {
            test(augur.getTradingFee(market_id));
        });
        it("async", function (done) {
            augur.getTradingFee(market_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getTradingFee", [market_id], function (r) {
                test(r);
            });
            batch.add("getTradingFee", [market_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
});
