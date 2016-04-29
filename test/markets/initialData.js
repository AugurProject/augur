/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var utils = require("../../src/utilities");
var augurpath = "../../src/index";
var augur = utils.setup(utils.reset(augurpath), process.argv.slice(2));

var branchId = augur.branches.dev;
var markets = augur.getMarketsInBranch(branchId);
var marketId = markets[markets.length - 1];

if (!process.env.CONTINUOUS_INTEGRATION) {

    describe("initial data load", function () {

        describe("getMarketsInfo", function () {
            var test = function (info, options, done) {
                if (utils.is_function(options) && !done) {
                    done = options;
                    options = undefined;
                }
                options = options || {};
                assert.isObject(info);
                var numMarkets = options.numMarkets || parseInt(augur.getNumMarkets(branchId));
                var market;
                assert.strictEqual(Object.keys(info).length, numMarkets);
                for (var marketId in info) {
                    if (!info.hasOwnProperty(marketId)) continue;
                    market = info[marketId];
                    assert.isArray(market.events);
                    assert.isAbove(market.events.length, 0);
                    assert.isString(market.type);
                    assert(market.type === "binary" ||
                           market.type === "categorical" ||
                           market.type === "scalar" ||
                           market.type === "combinatorial");
                    if (market.type === "combinatorial") {
                        for (var i = 0; i < market.numEvents; ++i) {
                            assert.isNumber(market.events[i].endDate);
                            assert.isString(market.events[i].id);
                            if (options.combinatorial) {
                                assert.isString(market.events[i].description);
                            }
                        }
                    }
                }
                if (done) done();
            };
            var params = {
                branch: branchId,
                offset: 0,
                numMarketsToLoad: 3
            };
            it("sync", function () {
                this.timeout(augur.constants.TIMEOUT);
                test(augur.getMarketsInfo(params), {numMarkets: params.numMarketsToLoad});
            });
            it("sync/missing numMarketsToLoad", function () {
                this.timeout(augur.constants.TIMEOUT);
                var p = augur.utils.copy(params);
                delete p.numMarketsToLoad;
                test(augur.getMarketsInfo(p));
            });
            it("sync/missing numMarketsToLoad/missing offset", function () {
                this.timeout(augur.constants.TIMEOUT);
                var p = augur.utils.copy(params);
                delete p.numMarketsToLoad;
                delete p.offset;
                test(augur.getMarketsInfo(p));
            });
            it("sync/combinatorial", function () {
                this.timeout(augur.constants.TIMEOUT);
                var p = augur.utils.copy(params);
                p.combinatorial = true;
                test(augur.getMarketsInfo(p), {
                    numMarkets: params.numMarketsToLoad,
                    combinatorial: true
                });
            });
            it("async", function (done) {
                this.timeout(augur.constants.TIMEOUT);
                params.callback = function (info) {
                    if (info.error) return done(info);
                    test(info, {numMarkets: params.numMarketsToLoad}, done);
                };
                augur.getMarketsInfo(params);
            });
            it("async/missing numMarketsToLoad", function (done) {
                this.timeout(augur.constants.TIMEOUT);
                var p = augur.utils.copy(params);
                delete p.numMarketsToLoad;
                p.callback = function (info) {
                    if (info.error) return done(info);
                    test(info, done);
                };
                augur.getMarketsInfo(p);
            });
            it("async/missing numMarketsToLoad/missing offset", function (done) {
                this.timeout(augur.constants.TIMEOUT);
                var p = augur.utils.copy(params);
                delete p.numMarketsToLoad;
                delete p.offset;
                p.callback = function (info) {
                    if (info.error) return done(info);
                    test(info, done);
                };
                augur.getMarketsInfo(p);
            });
            it("async/offset=1/numMarketsToLoad=2", function (done) {
                this.timeout(augur.constants.TIMEOUT);
                var numMarketsToLoad = 3;
                augur.getMarketsInfo({
                    branch: branchId,
                    offset: 1,
                    numMarketsToLoad: numMarketsToLoad,
                    callback: function (info) {
                        if (info.error) return done(info);
                        assert.strictEqual(Object.keys(info).length, numMarketsToLoad);
                        test(info, {numMarkets: numMarketsToLoad}, done);
                    }
                });
            });
            it("async/combinatorial", function (done) {
                this.timeout(augur.constants.TIMEOUT);
                var p = augur.utils.copy(params);
                p.combinatorial = true;
                p.callback = function (info) {
                    if (info.error) return done(info);
                    test(info, {
                        numMarkets: params.numMarketsToLoad,
                        combinatorial: true
                    }, done);
                };
                augur.getMarketsInfo(p);
            });
        });
    });
}
