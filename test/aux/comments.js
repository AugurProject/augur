/**
 * Test-driving Augur's whisper-based comments system
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var constants = require("../../src/constants");
var utilities = require("../../src/utilities");
var Augur = utilities.setup(require("../../src"), process.argv.slice(2));
var log = console.log;

describe("Comments (whisper)", function () {

    var market = "0x01";
    
    var pkg = { marketId: market, author: Augur.coinbase };

    it("should reset comments", function () {
        this.timeout(constants.TIMEOUT);
        assert(Augur.comments.resetComments(market));
    });

    it("should initally be no comments on market " + market, function () {
        this.timeout(constants.TIMEOUT);
        assert(!Augur.comments.getMarketComments(market));
    });
        
    it("should set up comments for market " + market + " and return the filter id", function () {
        this.timeout(constants.TIMEOUT);
        var filter = Augur.comments.initComments(market);
        assert(filter);
        assert(filter !== "0x");
        assert(Augur.comments.resetComments(market));
    });

    it("should add a comment to market " + market, function () {
        this.timeout(constants.TIMEOUT);
        Augur.comments.initComments(market);
        pkg.message = Math.random().toString(36).substring(4);
        var updated_comments = Augur.comments.addMarketComment(pkg);
        assert(updated_comments);
        assert.strictEqual(updated_comments.constructor, Array);
        assert.strictEqual(updated_comments.length, 1);
        assert(!updated_comments.error);
    });

    it("should add another comment to market " + market, function () {
        this.timeout(constants.TIMEOUT);
        pkg.message = Math.random().toString(36).substring(4);
        var updated_comments = Augur.comments.addMarketComment(pkg);
        assert(updated_comments);
        assert.strictEqual(updated_comments.constructor, Array);
        assert.strictEqual(updated_comments.length, 2);
        assert(!updated_comments.error);
    });

    it("should get the two comments for market " + market, function () {
        this.timeout(constants.TIMEOUT);
        var comments = Augur.comments.getMarketComments(market);
        assert(comments);
        assert.strictEqual(comments.length, 2);
    });

    it("should add a third comment to market " + market, function () {
        this.timeout(constants.TIMEOUT);
        pkg.message = Math.random().toString(36).substring(4);
        var updated_comments = Augur.comments.addMarketComment(pkg);
        assert(updated_comments);
        assert.strictEqual(updated_comments.constructor, Array);
        assert.strictEqual(updated_comments.length, 3);
        assert(!updated_comments.error);
    });

    it("should reset comments for market " + market, function () {
        this.timeout(constants.TIMEOUT);
        assert(Augur.comments.resetComments(market));
        assert(!Augur.comments.getMarketComments(market));
    });

    // crashes geth (!)
    // it("should uninstall filter " + filter, function () {
    //     this.timeout(constants.TIMEOUT);
    //     assert(Augur.comments.uninstallFilter(filter));
    // });
});
