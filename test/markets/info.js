/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));
var constants = augur.constants;
var log = console.log;

var branch_id = augur.branches.dev;
var branch_number = "0";
var accounts = utils.get_test_accounts(augur, constants.MAX_TEST_ACCOUNTS);
var test_account = accounts[0];
var markets = augur.getMarkets(branch_id);
var market_id = markets[0];
var market_creator_1 = test_account;
var market_id2 = markets[1];
var market_creator_2 = test_account;
var event_id = augur.getMarketEvents(market_id)[0];

// info.se
describe("info.se", function () {
    describe("getCreator(" + event_id + ") [event]", function () {
        it("sync", function () {
            var res = augur.getCreator(event_id);
            assert.strictEqual(res, test_account);
        });
        it("async", function (done) {
            augur.getCreator(event_id, function (r) {
                assert.strictEqual(r, test_account);
                done();
            });
        });
    });
    describe("getCreator(" + market_id + ") [market]", function () {
        it("sync", function () {
            var res = augur.getCreator(market_id);
            assert.strictEqual(res, test_account);
        });
        it("async", function (done) {
            augur.getCreator(market_id, function (r) {
                assert.strictEqual(r, test_account);
                done();
            });
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
    });
    describe("getDescription(" + event_id + ")", function () {
        var test = function (r) {
            assert(r.length);
        };
        it("sync", function () {
            test(augur.getDescription(event_id));
        });
        it("async", function (done) {
            augur.getDescription(event_id, function (r) {
                test(r); done();
            });
        });
    });
});
