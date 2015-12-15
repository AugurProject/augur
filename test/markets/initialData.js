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

var branchId = augur.branches.dev;
var markets = augur.getMarkets(branchId);
var marketId = markets[markets.length - 1];

describe("initial data load", function () {

    describe("getMarketsInfo", function () {
        var test = function (info, numMarkets, done) {
            if (utils.is_function(numMarkets) && !done) {
                done = numMarkets;
                numMarkets = undefined;
            }
            assert.isObject(info);
            numMarkets = numMarkets || parseInt(augur.getNumMarkets(branchId));
            assert.strictEqual(Object.keys(info).length, numMarkets);
            if (done) done();
        };
        var params = {
            branch: branchId,
            offset: 0,
            numMarketsToLoad: 3
        };
        it("sync/positional", function () {
            this.timeout(augur.constants.TIMEOUT);
            test(augur.getMarketsInfo(
                params.branch,
                params.offset,
                params.numMarketsToLoad
            ), params.numMarketsToLoad);
        });
        it("sync/positional/missing numMarketsToLoad", function () {
            this.timeout(augur.constants.TIMEOUT);
            test(augur.getMarketsInfo(params.branch, params.offset));
        });
        it("sync/positional/missing numMarketsToLoad/missing offset", function () {
            this.timeout(augur.constants.TIMEOUT);
            test(augur.getMarketsInfo(params.branch));
        });
        it("sync/object", function () {
            this.timeout(augur.constants.TIMEOUT);
            test(augur.getMarketsInfo(params), params.numMarketsToLoad);
        });
        it("sync/object/missing numMarketsToLoad", function () {
            this.timeout(augur.constants.TIMEOUT);
            var p = augur.utils.copy(params);
            delete p.numMarketsToLoad;
            test(augur.getMarketsInfo(p));
        });
        it("sync/object/missing numMarketsToLoad/missing offset", function () {
            this.timeout(augur.constants.TIMEOUT);
            var p = augur.utils.copy(params);
            delete p.numMarketsToLoad;
            delete p.offset;
            test(augur.getMarketsInfo(p));
        });
        it("async/positional", function (done) {
            this.timeout(augur.constants.TIMEOUT);
            augur.getMarketsInfo(
                params.branch,
                params.offset,
                params.numMarketsToLoad,
                function (info) {
                    if (info.error) return done(info);
                    test(info, params.numMarketsToLoad, done);
                }
            );
        });
        it("async/positional/missing numMarketsToLoad", function (done) {
            this.timeout(augur.constants.TIMEOUT);
            augur.getMarketsInfo(
                params.branch,
                params.offset,
                function (info) {
                    if (info.error) return done(info);
                    test(info, done);
                }
            );
        });
        it("async/positional/missing numMarketsToLoad/missing offset", function (done) {
            this.timeout(augur.constants.TIMEOUT);
            augur.getMarketsInfo(
                params.branch,
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
                test(info, params.numMarketsToLoad, done);
            };
            augur.getMarketsInfo(params);
        });
        it("async/object/missing numMarketsToLoad", function (done) {
            this.timeout(augur.constants.TIMEOUT);
            var p = augur.utils.copy(params);
            delete p.numMarketsToLoad;
            p.callback = function (info) {
                if (info.error) return done(info);
                test(info, done);
            };
            augur.getMarketsInfo(p);
        });
        it("async/object/missing numMarketsToLoad/missing offset", function (done) {
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
        it("async/object/offset=1/numMarketsToLoad=2", function (done) {
            this.timeout(augur.constants.TIMEOUT);
            var numMarketsToLoad = 3;
            augur.getMarketsInfo({
                branch: branchId,
                offset: 1,
                numMarketsToLoad: numMarketsToLoad,
                callback: function (info) {
                    if (info.error) return done(info);
                    assert.strictEqual(Object.keys(info).length, numMarketsToLoad);
                    test(info, numMarketsToLoad, done);
                }
            });
        });
    });
});
