(function () {
/**
 * Test-driving augur's whisper-based comments system
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var constants = require("../../src/constants");
var utils = require("../../src/utilities");
var augurpath = "../../src/index";
var augur = require(augurpath);
var log = console.log;

if (!process.env.CONTINUOUS_INTEGRATION) {

    describe("Whisper", function () {

        beforeEach(function () {
            augur = utils.setup(utils.reset(augurpath), process.argv.slice(2));
        });

        it("shh_newIdentity", function (done) {
            augur.comments.shh_newIdentity(function (res) {
                if (res.error) return done(res);
                assert.strictEqual(res.length, 132);
                done();
            });
        });

        it("shh_newFilter", function (done) {
            augur.comments.shh_newFilter({ topics: ["0x1010101"] }, function (res) {
                if (res.error) return done(res);
                assert.isNotNull(res);
                assert(parseInt(res) >= 0);
                augur.comments.shh_uninstallFilter(res, function (r) {
                    assert.isTrue(r);
                    done();
                });
            });
        });

        it("commentFilter", function (done) {
            augur.comments.commentFilter("0x10101", function (res) {
                if (res.error) return done(res);
                assert.isNotNull(res);
                assert(parseInt(res) >= 0);
                augur.comments.shh_uninstallFilter(res, function (r) {
                    assert.isTrue(r);
                    done();
                });
            });
        });

        it("shh_post", function (done) {
            var transmission = {
                topics: ["0x101"],
                payload: "0x5b7b22776869737065724964223a22307830343134616631343835663634646637626665313330326333336363636163383930313735663966633736333734313132626334633765636362616162396461393033353237323061633830636133336666626565373030373637633231626265386631386261613966323665363263313266343232353533323263373961613462222c2266726f6d223a22307830356165316430636136323036633631363862343265666364316662653065643134346538323162222c22636f6d6d656e74223a2231316d353865347a3873656d69222c2274696d65223a313434333539363731307d2c7b22776869737065724964223a22307830343831656164346337353565373730666362386331393135313235646163663539663733656534636665316632333162663835356439653935376466323766303836323634323235613531656263346363346232323266663665613030383363623737663539626164623937623864656337346230323665616361333466393638222c2266726f6d223a22307830356165316430636136323036633631363862343265666364316662653065643134346538323162222c22636f6d6d656e74223a2272386f7270366d6575336469222c2274696d65223a313434333539363730377d5d",
                priority: "0x64",
                ttl: "0x600"
            };
            augur.comments.shh_newIdentity(function (whisperId) {
                if (whisperId.error) return done(whisperId);
                assert.strictEqual(whisperId.length, 132);
                transmission.from = whisperId;
                augur.comments.commentFilter("0x101", function (filterId) {
                    if (filterId.error) return done(filterId);
                    assert.isNotNull(filterId);
                    assert(parseInt(filterId) >= 0);
                    augur.comments.shh_post(transmission, function (sent) {
                        if (sent.error) return done(sent);
                        assert.isTrue(sent);
                        augur.comments.shh_uninstallFilter(filterId, function (r) {
                            if (r.error) return done(r);
                            assert.isTrue(r);
                            done();
                        });
                    });
                });
            });
        });

        it("shh_getFilterChanges", function (done) {
            var transmission = {
                topics: ["0x1"],
                payload: "0x5b7b22776869737065724964223a22307830343134616631343835663634646637626665313330326333336363636163383930313735663966633736333734313132626334633765636362616162396461393033353237323061633830636133336666626565373030373637633231626265386631386261613966323665363263313266343232353533323263373961613462222c2266726f6d223a22307830356165316430636136323036633631363862343265666364316662653065643134346538323162222c22636f6d6d656e74223a2231316d353865347a3873656d69222c2274696d65223a313434333539363731307d2c7b22776869737065724964223a22307830343831656164346337353565373730666362386331393135313235646163663539663733656534636665316632333162663835356439653935376466323766303836323634323235613531656263346363346232323266663665613030383363623737663539626164623937623864656337346230323665616361333466393638222c2266726f6d223a22307830356165316430636136323036633631363862343265666364316662653065643134346538323162222c22636f6d6d656e74223a2272386f7270366d6575336469222c2274696d65223a313434333539363730377d5d",
                priority: "0x64",
                ttl: "0x600"
            };
            augur.comments.shh_newIdentity(function (whisperId) {
                if (whisperId.error) return done(whisperId);
                assert.strictEqual(whisperId.length, 132);
                transmission.from = whisperId;
                augur.comments.commentFilter("0x1", function (filterId) {
                    if (filterId.error) return done(filterId);
                    assert.isNotNull(filterId);
                    assert(parseInt(filterId) >= 0);
                    augur.comments.shh_post(transmission, function (sent) {
                        if (sent.error) return done(sent);
                        assert.isTrue(sent);
                        augur.comments.shh_getFilterChanges(filterId, function (filtrate) {
                            if (filtrate.error) return done(filtrate);
                            augur.comments.shh_uninstallFilter(filterId, function (r) {
                                if (r.error) return done(r);
                                assert.isTrue(r);
                                done();
                            });
                        })
                    });
                });
            });
        });

    });

}

describe("Comments", function () {
    var filter, markets, market, pkg;

    augur = utils.setup(utils.reset(augurpath), process.argv.slice(2));
    markets = augur.getMarkets(augur.branches.dev);
    market = markets[markets.length - 1];
    pkg = { marketId: market, author: augur.coinbase };

    it("should reset comments", function () {
        this.timeout(constants.TIMEOUT);
        assert(augur.comments.resetComments(market));
    });

    if (!process.env.CONTINUOUS_INTEGRATION) {

        it("should initally be no comments on market " + market, function () {
            this.timeout(constants.TIMEOUT);
            assert(!augur.comments.getMarketComments(market));
        });

    }

    it("should set up comments for market " + market + " and return the filter id", function () {
        this.timeout(constants.TIMEOUT);
        filter = augur.comments.initComments(market);
        assert(filter);
        assert.notStrictEqual(filter, "0x");
        assert.isTrue(augur.comments.resetComments(market));
    });

    if (!process.env.CONTINUOUS_INTEGRATION) {

        it("should add a comment to market " + market, function () {
            this.timeout(constants.TIMEOUT);
            augur.comments.initComments(market);
            pkg.message = Math.random().toString(36).substring(4);
            var updated_comments = augur.comments.addMarketComment(pkg);
            assert(updated_comments);
            assert.strictEqual(updated_comments.constructor, Array);
            assert.strictEqual(updated_comments.length, 1);
            assert(!updated_comments.error);
        });

        it("should add another comment to market " + market, function () {
            this.timeout(constants.TIMEOUT);
            pkg.message = Math.random().toString(36).substring(4);
            var updated_comments = augur.comments.addMarketComment(pkg);
            assert(updated_comments);
            assert.strictEqual(updated_comments.constructor, Array);
            assert.strictEqual(updated_comments.length, 2);
            assert(!updated_comments.error);
        });

        it("should get the two comments for market " + market, function () {
            this.timeout(constants.TIMEOUT);
            var comments = augur.comments.getMarketComments(market);
            assert.isArray(comments);
            assert.strictEqual(comments.length, 2);
        });

        it("should add a third comment to market " + market, function () {
            this.timeout(constants.TIMEOUT);
            pkg.message = Math.random().toString(36).substring(4);
            var updated_comments = augur.comments.addMarketComment(pkg);
            assert(updated_comments);
            assert.strictEqual(updated_comments.constructor, Array);
            assert.strictEqual(updated_comments.length, 3);
            assert(!updated_comments.error);
        });

        it("should reset comments for market " + market, function () {
            this.timeout(constants.TIMEOUT);
            assert(augur.comments.resetComments(market));
            assert(!augur.comments.getMarketComments(market));
        });

    }

});

})();
