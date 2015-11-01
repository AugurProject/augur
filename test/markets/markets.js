/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var utils = require("../../src/utilities");
var augurpath = "../../src/index";
var augur = utils.setup(utils.reset(augurpath), process.argv.slice(2));
var constants = augur.constants;

var amount = "1";
var branch_id = augur.branches.dev;
var accounts = utils.get_test_accounts(augur, constants.MAX_TEST_ACCOUNTS);
var participant_number = "1";
var outcome = 1;
var markets = augur.getMarkets(branch_id);
var market_id = markets[markets.length - 1];
var event_id = augur.getMarketEvents(market_id)[0];

describe("markets.se", function () {
    before(function () {
        augur = utils.setup(utils.reset(augurpath), process.argv.slice(2));
    });
    var testMarketInfo = function (r) {
        // console.log(JSON.stringify(r, null, 2));
        var market = r._id;
        assert.isObject(r);
        assert.property(r, "_id");
        assert.property(r, "network");
        assert(r.network === "7" || r.network === "10101");
        assert.property(r, "traderCount");
        assert.isAbove(r.traderIndex, -1);
        assert.strictEqual(parseInt(augur.getCurrentParticipantNumber(market)), r.traderCount);
        assert.property(r, "alpha");
        assert.isNotNull(r.alpha);
        assert.property(r, "traderIndex");
        assert.isAbove(r.traderIndex, -1);
        assert.property(r, "numOutcomes");
        assert.isAbove(r.numOutcomes, 1);
        assert.strictEqual(parseInt(augur.getMarketNumOutcomes(market)), r.numOutcomes);
        assert.property(r, "tradingPeriod");
        assert.isNumber(r.tradingPeriod);
        assert.strictEqual(parseInt(augur.getTradingPeriod(market)), r.tradingPeriod);
        assert.property(r, "tradingFee");
        assert(abi.number(r.tradingFee) >= 0);
        assert(abi.number(r.tradingFee) <= 1);
        assert.strictEqual(augur.getTradingFee(market), r.tradingFee);
        assert.property(r, "branchId");
        assert.strictEqual(augur.getBranchID(market), r.branchId);
        assert.property(r, "numEvents");
        assert.strictEqual(parseInt(augur.getNumEvents(market)), r.numEvents);
        assert.property(r, "cumulativeScale");
        assert.property(r, "creationFee");
        assert.strictEqual(augur.getCreationFee(market), r.creationFee);
        assert.property(r, "author");
        assert.strictEqual(augur.getCreator(market), r.author);
        assert.property(r, "endDate");
        assert.property(r, "participants");
        assert.isObject(r.participants);
        assert.property(r, "outcomes");
        assert.isArray(r.outcomes);
        assert.isAbove(r.outcomes.length, 1);
        for (var i = 0, len = r.outcomes.length; i < len; ++i) {
            assert.property(r.outcomes[i], "id");
            assert.isNumber(r.outcomes[i].id);
            assert.property(r.outcomes[i], "outstandingShares");
            assert(abi.number(r.outcomes[i].outstandingShares) >= 0);
            assert.property(r.outcomes[i], "price");
            assert.strictEqual(r.outcomes[i].price, augur.price(market, i + 1));
            assert.property(r.outcomes[i], "shares");
            assert.isObject(r.outcomes[i].shares);
        }
        assert.property(r, "events");
        assert.isArray(r.events);
        assert.isAbove(r.events.length, 0);
        var marketEvents = augur.getMarketEvents(market);
        assert.strictEqual(marketEvents.length, r.events.length);
        for (var i = 0, len = r.events.length; i < len; ++i) {
            assert.isObject(r.events[i]);
            assert.property(r.events[i], "id");
            assert.strictEqual(marketEvents[i], r.events[i].id);
            assert.property(r.events[i], "endDate");
            assert.isAbove(r.events[i].endDate, 0);
            assert.property(r.events[i], "outcome");
            assert.isNotNull(r.events[i].outcome);
            assert.property(r.events[i], "minValue");
            assert.isNotNull(r.events[i].minValue);
            assert.property(r.events[i], "maxValue");
            assert.isNotNull(r.events[i].maxValue);
            assert.property(r.events[i], "numOutcomes");
            assert.isAbove(parseInt(r.events[i].numOutcomes), 1);
        }
    };
    describe("getMarketInfo", function () {
        it("sync", function () {
            this.timeout(augur.constants.TIMEOUT);
            var info = augur.getMarketInfo(market_id);
            if (info.error) throw info;
            testMarketInfo(info);
        });
        it("async", function (done) {
            this.timeout(augur.constants.TIMEOUT);
            augur.getMarketInfo(market_id, function (info) {
                if (info.error) return done(info);
                testMarketInfo(info);
                done();
            });
        });
    });
    describe("getMarketsInfo", function () {
        var test = function (marketInfo, done) {
            assert.isObject(marketInfo);
            assert.isAbove(Object.keys(marketInfo).length, 0);
            for (var market in marketInfo) {
                if (!marketInfo.hasOwnProperty(market)) continue;
                testMarketInfo(marketInfo[market]);
            }
            if (done) done();
        };
        var params = {
            branch: branch_id,
            offset: 0,
            numMarketsToLoad: 0
        };
        it("sync/positional", function () {
            this.timeout(augur.constants.TIMEOUT);
            test(augur.getMarketsInfo(
                params.branch,
                params.offset,
                params.numMarketsToLoad
            ));
        });
        it("sync/object", function () {
            this.timeout(augur.constants.TIMEOUT);
            test(augur.getMarketsInfo(params));
        });
        it("async/positional", function (done) {
            this.timeout(augur.constants.TIMEOUT);
            augur.getMarketsInfo(
                params.branch,
                params.offset,
                params.numMarketsToLoad,
                function (info) {
                    if (info.error) return done(info);
                    test(info, done);
                }
            );
        });
        it("async/object", function (done) {
            this.timeout(augur.constants.TIMEOUT);
            params.callback = function (info) {
                if (info.error) return done(info);
                test(info, done);
            };
            augur.getMarketsInfo(params);
        });
        it("async/object/offset", function (done) {
            this.timeout(augur.constants.TIMEOUT);
            var offset = 1;
            var marketsToLoad = 2;
            augur.getMarketsInfo({
                branch: branch_id,
                offset: offset,
                numMarketsToLoad: marketsToLoad,
                callback: function (info) {
                    if (info.error) return done(info);
                    assert.strictEqual(Object.keys(info).length, marketsToLoad);
                    test(info, done);
                }
            });
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
