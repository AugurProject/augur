(function () {
/**
 * Comments tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var constants = require("../../src/constants");
var utils = require("../../src/utilities");
var augurpath = "../../src/index";
var augur = utils.setup(require(augurpath), process.argv.slice(2));
var log = console.log;

describe("Comments", function () {
    var markets, market, comment;

    beforeEach(function (done) {
        augur = utils.setup(utils.reset(augurpath), process.argv.slice(2));
        done();
    });

    markets = augur.getMarkets(augur.branches.dev);
    market = markets[markets.length - 1];
    comment = {marketId: market, author: augur.coinbase, message: "why hello!"};

    it("should add a comment to market " + market, function (done) {
        this.timeout(constants.TIMEOUT);
        augur.comments.addMarketComment(comment,
            function (res) {
                assert.property(res, "txHash");
                assert.strictEqual(res.callReturn, "1");
            },
            function (res) {
                assert.property(res, "txHash");
                assert.strictEqual(res.callReturn, "1");
                assert.strictEqual(res.from, augur.coinbase);
                assert.strictEqual(res.to, augur.contracts.comments);
                assert.isAbove(Number(res.blockHash), 0);
                assert.isAbove(Number(res.blockNumber), 0);
                assert.strictEqual(Number(res.value), 0);
                done();
            },
            done
        );
    });

    it("should get comments for market " + market, function (done) {
        this.timeout(constants.TIMEOUT);
        augur.comments.getMarketComments(market, function (comments) {
            assert.isAbove(comments.length, 0);
            assert.isArray(comments);
            for (var i = 0, len = comments.length; i < len; ++i) {
                assert.isObject(comments[i]);
                assert.property(comments[i], "author");
                assert.property(comments[i], "message");
                assert.property(comments[i], "blockNumber");
            }
            done();
        });
    });

});

})();
