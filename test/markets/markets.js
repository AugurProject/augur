/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var async = require("async");
var assert = require("chai").assert;
var abi = require("augur-abi");
var utils = require("../../src/utilities");
var constants = require("../../src/constants");
var augurpath = "../../src/index";
var augur = utils.setup(utils.reset(augurpath), process.argv.slice(2));

var amount = "1";
var branchId = augur.branches.dev;
var accounts = utils.get_test_accounts(augur, constants.MAX_TEST_ACCOUNTS);
var traderIndex = "1";
var outcome = 1;
var markets = augur.getMarkets(branchId);
var numMarkets = markets.length;
var marketId = utils.select_random(markets);
if (numMarkets > constants.MAX_TEST_SAMPLES) {
    var randomMarkets = [];
    numMarkets = constants.MAX_TEST_SAMPLES;
    do {
        if (randomMarkets.indexOf(marketId) === -1) {
            randomMarkets.push(marketId);
        }
        marketId = utils.select_random(markets);
    } while (randomMarkets.length < constants.MAX_TEST_SAMPLES);
    markets = randomMarkets;
}

var errorCheck = function (output, done) {
    done = done || utils.pass;
    if (output && output.constructor === Object && output.error) {
        return done(new Error(JSON.stringify(output)));
    }
    return {output: output, done: done};
};

var runtests = function (method, test) {
    var arglen = arguments.length;
    var params = new Array(arglen - 2);
    if (params.length) {
        for (var i = 2; i < arglen; ++i) {
            params[i - 2] = arguments[i];
        }
    }
    describe(params.toString(), function () {
        it("async", function (done) {
            this.timeout(constants.TIMEOUT);
            augur[method].apply(augur, params.concat(function (output) {
                test(errorCheck(output, done));
            }));
        });
        it("sync", function (done) {
            this.timeout(constants.TIMEOUT);
            var output = augur[method].apply(augur, params);
            test(errorCheck(output, done));
        });
        it("batch", function (done) {
            this.timeout(constants.TIMEOUT);
            var batch = augur.createBatch();
            batch.add(method, params, function (output) {
                test(errorCheck(output));
            });
            batch.add(method, params, function (output) {
                test(errorCheck(output, done));
            });
            batch.execute();
        });
    });
};

var testMarketInfo = function (info) {
    var r;
    assert(info.constructor === Array || info.constructor === Object);
    if (info.constructor === Array) {
        assert.isAbove(info.length, 43);
        info = augur.rpc.encodeResult(info);
        assert.strictEqual(info[7], branchId);
        r = augur.parseMarketInfo(info);
        r._id = abi.hex(info[0]);
        if (r.numEvents > 1) {
            var txList = new Array(r.numEvents);
            for (var i = 0; i < r.numEvents; ++i) {
                txList[i] = utils.copy(augur.tx.getDescription);
                txList[i].params = r.events[i].id;
            }
            var response = augur.rpc.batch(txList);
            for (i = 0; i < response.length; ++i) {
                r.events[i].description = response[i];
            }
        }
    } else {
        r = info;
    }
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
        assert.strictEqual(
            abi.number(r.outcomes[i].price).toFixed(4),
            abi.number(augur.price(market, i + 1)).toFixed(4)
        );
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

describe("data and api/markets", function () {
    before(function () {
        augur = utils.setup(utils.reset(augurpath), process.argv.slice(2));
    });
    describe("getMarketInfo", function () {
        var test = function (t) {
            testMarketInfo(t.output);
            t.done();
        };
        for (var i = 0; i < numMarkets; ++i) {
            runtests(this.title, test, markets[i]);
        }
    });
    describe("getSimulatedBuy", function () {
        var test = function (t) {
            assert.isArray(t.output);
            assert.isAbove(t.output.length, 0);
            t.done();
        };
        for (var i = 0; i < numMarkets; ++i) {
            runtests(this.title, test, markets[i], outcome, amount);
        }
    });
    describe("getSimulatedSell", function () {
        var test = function (t) {
            assert.isArray(t.output);
            assert.isAbove(t.output.length, 0);
            t.done();
        };
        for (var i = 0; i < numMarkets; ++i) {
            runtests(this.title, test, markets[i], outcome, amount);
        }
    });
    describe("lsLmsr", function () {
        var test = function (t) {
            var output = t.output;
            assert.isAbove(abi.number(output), 0);
            t.done();
        };
        for (var i = 0; i < numMarkets; ++i) {
            runtests(this.title, test, markets[i]);
        }
    });
    describe("getMarketEvents", function () {
        var test = function (t) {
            assert.isArray(t.output);
            assert.isAbove(t.output.length, 0);
            assert.isBelow(t.output.length, 4);
            async.each(t.output, function (event, nextEvent) {
                augur.getDescription(event, function (desc) {
                    if (desc.error) return nextEvent(desc);
                    assert.isString(desc);
                    assert.isAbove(desc.length, 0);
                    nextEvent();
                });
            }, t.done);
        };
        for (var i = 0; i < numMarkets; ++i) {
            runtests(this.title, test, markets[i]);
        }
    });
    describe("getNumEvents", function () {
        var test = function (t) {
            var output = parseInt(t.output);
            assert.isNumber(output);
            assert.isAbove(output, 0);
            assert.isBelow(output, 4);
            t.done();
        };
        for (var i = 0; i < numMarkets; ++i) {
            runtests(this.title, test, markets[i]);
        }
    });
    describe("getBranchID", function () {
        var test = function (t) {
            assert.strictEqual(abi.hex(t.output), abi.hex(augur.branches.dev));
            t.done();
        };
        for (var i = 0; i < numMarkets; ++i) {
            runtests(this.title, test, markets[i]);
        }
    });
    describe("getCurrentParticipantNumber", function () {
        var test = function (t) {
            utils.gteq0(t.output);
            t.done();
        };
        for (var i = 0; i < numMarkets; ++i) {
            runtests(this.title, test, markets[i]);
        }
    });
    describe("getMarketNumOutcomes", function () {
        var test = function (t) {
            assert.isAbove(parseInt(t.output), 1);
            t.done();
        };
        for (var i = 0; i < numMarkets; ++i) {
            runtests(this.title, test, markets[i]);
        }
    });
    describe("getParticipantSharesPurchased", function () {
        var test = function (t) {
            utils.gteq0(t.output);
            t.done();
        };
        for (var i = 0; i < numMarkets; ++i) {
            runtests(this.title, test, markets[i], traderIndex, outcome);
        }
    });
    describe("getSharesPurchased", function () {
        var test = function (t) {
            utils.gteq0(t.output);
            t.done();
        };
        for (var i = 0; i < numMarkets; ++i) {
            runtests(this.title, test, markets[i], outcome);
        }
    });
    describe("getWinningOutcomes", function () {
        var test = function (t) {
            assert.isArray(t.output);
            t.done();
        };
        for (var i = 0; i < numMarkets; ++i) {
            runtests(this.title, test, markets[i]);
        }
    });
    describe("price", function () {
        var test = function (t) {
            assert.isNumber(abi.number(t.output));
            t.done();
        };
        for (var i = 0; i < numMarkets; ++i) {
            runtests(this.title, test, markets[i], outcome);
        }
    });
    describe("getParticipantNumber", function () {
        var test = function (t) {
            utils.gteq0(t.output);
            t.done();
        };
        for (var i = 0; i < numMarkets; ++i) {
            runtests(this.title, test, markets[i], accounts[0]);
        }
    });
    describe("getParticipantID", function () {
        var test = function (t) {
            utils.gteq0(t.output);
            t.done();
        };
        for (var i = 0; i < numMarkets; ++i) {
            runtests(this.title, test, markets[i], traderIndex);
        }
    });
    describe("getAlpha", function () {
        var test = function (t) {
            assert.strictEqual(abi.number(t.output).toFixed(4), "0.0079");
            t.done();
        };
        for (var i = 0; i < numMarkets; ++i) {
            runtests(this.title, test, markets[i]);
        }
    });
    describe("getCumScale", function () {
        var test = function (t) {
            assert.isAbove(abi.number(t.output), 0);
            t.done();
        };
        for (var i = 0; i < numMarkets; ++i) {
            runtests(this.title, test, markets[i]);
        }
    });
    describe("getTradingPeriod", function () {
        var test = function (t) {
            assert.isAbove(abi.number(t.output), -2);
            t.done();
        };
        for (var i = 0; i < numMarkets; ++i) {
            runtests(this.title, test, markets[i]);
        }
    });
    describe("getTradingFee", function () {
        var test = function (t) {
            var output = t.output;
            assert.isAbove(abi.number(output), 0);
            t.done();
        };
        for (var i = 0; i < numMarkets; ++i) {
            runtests(this.title, test, markets[i]);
        }
    });
});
