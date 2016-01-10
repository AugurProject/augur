/**
 * augur unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

GLOBAL.augur = require("augur.js");
augur.connect("https://eth3.augur.net");

var test = require("tape");
var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var _ = require("lodash");
var moment = require("moment");

var constants = require("../app/libs/constants");
var MarketActions = require("../app/actions/MarketActions");
var market = require("./market");
var blockNumber = augur.rpc.blockNumber();
market.id = new BigNumber(market._id);

MarketActions.flux = {
    actions: {
        market: MarketActions
    },
    store: function (store) {
        switch (store) {
        case "market":
            return {
                getMarket: function (marketId) {
                    return market;
                }
            }
            break;
        case "network":
            return {
                getState: function () {
                    return {blockNumber: blockNumber};
                }
            }
            break;
        case "config":
            return {
                getAccount: function () {
                    return augur.from;
                }
            }
            break;
        default:
            throw new Error("unknown store");
        }
    }
};

test("loadComments", function (t) {
    t.plan(2);
    MarketActions.dispatch = function (label, payload) {
        t.equal(label, "UPDATE_MARKET_SUCCESS", "dispatch: " + label);
        t.deepEqual(payload.market, market, "verify payload");
        t.end();
    };
    MarketActions.loadComments(market);
});

test("updateComments", function (t) {
    t.plan(2);
    var message = "hello from augur's unit tests!";
    MarketActions.dispatch = function (label, payload) {
        t.pass(label, "UPDATE_MARKET_SUCCESS", "dispatch: " + label);
        t.deepEqual(payload.market, market, "verify payload");
        t.end();
    };
    MarketActions.updateComments(message, market.id, augur.from);
});

test("addComment", function (t) {
    t.plan(2);
    var commentText = "hello from augur's unit tests!";
    var account = {address: augur.from};
    MarketActions.dispatch = function (label, payload) {
        t.pass(label, "UPDATE_MARKET_SUCCESS", "dispatch: " + label);
        t.deepEqual(payload.market, market, "verify payload");
        t.end();
    };
    MarketActions.addComment(commentText, market.id, account);
});

test("parseMarketInfo", function (t) {
    t.end();
});

test("loadMarkets", function (t) {
    t.end();
});

test("loadMarket", function (t) {
    t.end();
});
