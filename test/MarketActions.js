/**
 * augur unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

var augur = require("augur.js");
var test = require("tape");
var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var _ = require("lodash");
var validator = require("validator");
var moment = require("moment");
var utils = require("../app/libs/utilities");
var constants = require("../app/libs/constants");
var MarketActions = require("../app/actions/MarketActions");

augur.connect("https://eth3.augur.net");

var account = {address: augur.from};
var blockNumber = augur.rpc.blockNumber();
var marketInfo = require("./marketInfo");
var rawInfo = _.cloneDeep(marketInfo);
marketInfo.id = new BigNumber(marketInfo._id);
marketInfo.endDate = utils.blockToDate(marketInfo.endDate, blockNumber);
marketInfo.creationBlock = utils.blockToDate(marketInfo.creationBlock, blockNumber)
marketInfo.price = new BigNumber(marketInfo.price);
marketInfo.tradingFee = new BigNumber(marketInfo.tradingFee);
marketInfo.creationFee = new BigNumber(marketInfo.creationFee);
marketInfo.traderCount = new BigNumber(marketInfo.traderCount);
marketInfo.alpha = new BigNumber(marketInfo.alpha);
marketInfo.tradingPeriod = new BigNumber(marketInfo.tradingPeriod);
var traderId = marketInfo.participants[account.address];
if (traderId) marketInfo.traderId = new BigNumber(traderId);
for (var i = 0; i < marketInfo.numEvents; ++i) {
    marketInfo.events[i].endDate = utils.blockToDate(marketInfo.events[i].endDate);
}

// mock flux
MarketActions.flux = {
    actions: {
        asset: {
            updateAssets: function () {}
        },
        market: MarketActions,
        config: {
            updatePercentLoaded: function (percentLoaded) {
                return percentLoaded;
            }
        }
    },
    stores: {
        branch: {
            getCurrentBranch: function () {
                return {id: augur.branches.dev};
            }
        },
        market: {
            getMarket: function (marketId) {
                return marketInfo;
            },
            getState: function () {
                var markets = {};
                markets[marketInfo.id] = _.cloneDeep(marketInfo);
                return {markets: markets};
            }
        },
        network: {
            getState: function () {
                return {blockNumber: blockNumber};
            }
        },
        config: {
            getAccount: function () {
                return augur.from;
            }
        }
    },
    store: function (store) {
        return this.stores[store];
    }
};

test("marketInfo", function (t) {
    var market = rawInfo._id;
    t.plan(29 + rawInfo.numOutcomes*8 + rawInfo.numEvents*11);
    t.false(rawInfo.id, "raw marketInfo's id field is unassigned");
    t.true(validator.isHexadecimal(abi.unfork(rawInfo._id)), "unfork(_id) is valid hex");
    t.true(validator.isNumeric(rawInfo.network), "network is numeric");
    t.true(validator.isIn(rawInfo.network, ["7", "10101"]), "network is 7 or 10101");
    t.true(validator.isInt(rawInfo.traderCount), "traderCount is an integer");
    t.true(rawInfo.traderIndex > -1, "traderIndex > -1");
    t.equal(rawInfo.alpha, "0.00790000000000000001", "alpha == 0.00790000000000000001");
    t.true(validator.isInt(rawInfo.tradingPeriod), "tradingPeriod is an integer");
    t.true(validator.isFloat(rawInfo.tradingFee), "tradingFee is a float");
    t.true(rawInfo.tradingFee > 0, "tradingFee > 0");
    t.true(rawInfo.tradingFee <= 1, "tradingFee <= 1");
    t.true(validator.isHexadecimal(abi.unfork(rawInfo.branchId)), "unfork(branchId) is valid hex");
    t.true(validator.isInt(rawInfo.numEvents), "numEvents is an integer");
    t.true(rawInfo.numEvents >= 1, "numEvents >= 1");
    t.true(validator.isInt(rawInfo.cumulativeScale), "cumulativeScale is a (string) integer");
    t.true(validator.isInt(rawInfo.creationFee), "creationFee is a (string) integer");
    t.true(Number(rawInfo.creationFee) > 0, "Number(creationFee) > 0");
    t.true(validator.isHexadecimal(abi.unfork(rawInfo.author)), "unfork(author) is valid hex");
    t.true(validator.isInt(rawInfo.endDate), "endDate is an integer");
    t.equal(rawInfo.participants.constructor, Object, "participants is an object");
    t.true(Object.keys(rawInfo.participants).length > 0, "number of participants > 0");
    t.true(validator.isInt(rawInfo.numOutcomes), "numOutcomes is an integer");
    t.true(rawInfo.numOutcomes > 1, "numOutcomes > 1");
    t.equal(rawInfo.outcomes.constructor, Array, "outcomes is an array");
    t.equal(rawInfo.numOutcomes, rawInfo.outcomes.length, "numOutcomes == outcomes.length");
    var outcome;
    for (var i = 0; i < rawInfo.numOutcomes; ++i) {
        outcome = rawInfo.outcomes[i];
        t.equal(outcome.constructor, Object, "outcome is an object");
        t.true(validator.isInt(outcome.id), "outcome.id is an integer");
        t.true(outcome.id > 0, "outcome.id > 0");
        t.true(validator.isFloat(outcome.outstandingShares), "outcome.outstandingShares is a (string) float");
        t.true(parseFloat(outcome.outstandingShares) > 0, "outcome.outstandingShares > 0");
        t.true(validator.isFloat(outcome.price), "outcome.price is a (string) float");
        t.equal(outcome.shares.constructor, Object, "outcome.shares is an object");
        t.true(Object.keys(outcome.shares).length > 0, "number of share holders > 0");
    }
    t.equal(rawInfo.events.constructor, Array, "events is an array");
    t.true(rawInfo.numEvents > 0, "numEvents > 0");
    t.true(rawInfo.events.length > 0, "events.length > 0");
    t.equal(rawInfo.numEvents, rawInfo.events.length, "numEvents == events.length");
    var event;
    for (i = 0; i < rawInfo.numEvents; ++i) {
        event = rawInfo.events[i];
        t.equal(event.constructor, Object, "event is an object");
        t.true(validator.isHexadecimal(abi.unfork(event.id)), "unfork(event.id) is valid hex");
        t.true(validator.isInt(event.endDate), "event.endDate is an integer");
        t.true(event.endDate > 0, "event.endDate > 0");
        t.true(validator.isInt(event.outcome), "event.outcome is a (string) integer");
        t.true(parseInt(event.outcome) >= 0, "event.outcome >= 0");
        t.true(validator.isInt(event.minValue), "event.minValue is a (string) integer");
        t.true(validator.isInt(event.maxValue), "event.maxValue is a (string) integer");
        t.true(parseInt(event.minValue) < parseInt(event.maxValue), "event.minValue < event.maxValue");
        t.true(validator.isInt(event.numOutcomes), "event.numOutcomes is an integer");
        t.true(event.numOutcomes > 1, "event.numOutcomes > 1");
    }
    t.end();
});

test("loadComments", function (t) {
    t.plan(2);
    MarketActions.dispatch = function (label, payload) {
        t.equal(label, "UPDATE_MARKET_SUCCESS", "dispatch: " + label);
        t.deepEqual(payload.market, marketInfo, "verify payload");
        t.end();
    };
    MarketActions.loadComments(marketInfo);
});

test("updateComments", function (t) {
    t.plan(2);
    var message = "hello from augur's unit tests!";
    MarketActions.dispatch = function (label, payload) {
        t.equal(label, "UPDATE_MARKET_SUCCESS", "dispatch: " + label);
        t.deepEqual(payload.market, marketInfo, "verify payload");
        t.end();
    };
    MarketActions.updateComments(message, marketInfo.id, augur.from);
});

test("addComment", function (t) {
    t.plan(2);
    var commentText = "hello from augur's unit tests!";
    MarketActions.dispatch = function (label, payload) {
        t.equal(label, "UPDATE_MARKET_SUCCESS", "dispatch: " + label);
        t.deepEqual(payload.market, marketInfo, "verify payload");
        t.end();
    };
    MarketActions.addComment(commentText, marketInfo.id, account);
});

test("parseMarketInfo", function (t) {
    t.plan(21);
    var info = _.cloneDeep(rawInfo);
    MarketActions.dispatch = function (label, payload) { throw new Error(); };
    augur.getMarketCreationBlock(rawInfo._id, function (creationBlock) {
        t.true(validator.isInt(creationBlock), "creation block number is an integer");
        info.creationBlock = creationBlock;
        augur.getMarketPriceHistory(rawInfo._id, function (priceHistory) {
            t.equal(priceHistory.constructor, Object, "priceHistory is an object");
            info.priceHistory = priceHistory;
            MarketActions.parseMarketInfo(_.cloneDeep(info), function (parsedInfo) {
                t.false(rawInfo.id, "raw marketInfo's id field is unassigned after parseMarketInfo");
                t.equal(parsedInfo.id.constructor, BigNumber, "parsed marketInfo.id is a BigNumber");
                t.true(parsedInfo.id.eq(new BigNumber(rawInfo._id)), "check parsed marketInfo.id value");
                t.equal(parsedInfo.price.constructor, BigNumber, "parsed marketInfo.price is a BigNumber");
                t.true(parsedInfo.price.eq(marketInfo.price), "check parsed marketInfo.price value");
                t.equal(parsedInfo.tradingFee.constructor, BigNumber, "parsed marketInfo.tradingFee is a BigNumber");
                t.true(parsedInfo.tradingFee.eq(marketInfo.tradingFee), "check parsed marketInfo.tradingFee value");
                t.equal(parsedInfo.creationFee.constructor, BigNumber, "parsed marketInfo.creationFee is a BigNumber");
                t.true(parsedInfo.creationFee.eq(marketInfo.creationFee), "check parsed marketInfo.creationFee value");
                t.equal(parsedInfo.traderCount.constructor, BigNumber, "parsed marketInfo.traderCount is a BigNumber");
                t.true(parsedInfo.traderCount.eq(marketInfo.traderCount), "check parsed marketInfo.traderCount value");
                t.equal(parsedInfo.alpha.constructor, BigNumber, "parsed marketInfo.alpha is a BigNumber");
                t.true(parsedInfo.alpha.eq(marketInfo.alpha), "check parsed marketInfo.alpha value");
                t.equal(parsedInfo.tradingPeriod.constructor, BigNumber, "parsed marketInfo.tradingPeriod is a BigNumber");
                t.true(parsedInfo.tradingPeriod.eq(marketInfo.tradingPeriod), "check parsed marketInfo.tradingPeriod value");
                if (marketInfo.traderId) {
                    t.equal(parsedInfo.traderId.constructor, BigNumber, "parsed marketInfo.traderId is a BigNumber");
                    t.true(parsedInfo.traderId.eq(marketInfo.traderId), "check parsed marketInfo.traderId value");
                } else {
                    t.false(parsedInfo.traderId, "parsed marketInfo.traderId is unassigned");
                    t.equal(parsedInfo.traderId, marketInfo.traderId, "check parsed marketInfo.traderId value");
                }
                t.true(moment.isMoment(parsedInfo.creationDate), "parsed marketInfo.creationDate is a Moment");
                t.true(moment.isMoment(parsedInfo.endDate), "parsed marketInfo.endDate is a Moment");
                t.end();
            });
        });
    });
});

test("loadMarkets", function (t) {
    var dispatchCount = 0;
    MarketActions.dispatch = function (label, payload) {
        t.true(validator.isIn(label, ["LOAD_MARKETS_SUCCESS", "MARKETS_LOADING"]), "label is LOAD_MARKETS_SUCCESS or MARKETS_LOADING");
        if (label === "LOAD_MARKETS_SUCCESS") {
            t.equal(payload.markets[marketInfo.id].constructor, Object, "payload.markets has marketInfo.id field");
            t.true(Object.keys(payload.markets).length > 0, "payload.markets has at least 1 key");
        } else if (label === "MARKETS_LOADING") {
            t.equal(payload.loadingPage, null, "payload.loadingPage is null");
        }
        if (++dispatchCount > 1) t.end();
    };
    MarketActions.loadMarkets();
});

test("loadMarket", function (t) {
    t.plan(4);
    var dispatchCount = 0;
    MarketActions.dispatch = function (label, payload) {
        t.true(validator.isIn(label, ["LOAD_MARKETS_SUCCESS", "MARKETS_LOADING"]), "label is LOAD_MARKETS_SUCCESS or MARKETS_LOADING");
        if (label === "LOAD_MARKETS_SUCCESS") {
            t.equal(payload.markets[marketInfo.id].constructor, Object, "payload.markets has marketInfo.id field");
        } else if (label === "MARKETS_LOADING") {
            t.equal(payload.loadingPage, null, "payload.loadingPage is null");
        }
        if (++dispatchCount > 1) t.end();
    };
    MarketActions.loadMarket(marketInfo.id);
});

test("initMarket", function (t) {
    t.plan(4);
    var skeleton = MarketActions.initMarket(marketInfo.id);
    t.equal(skeleton.constructor, Object, "skeleton is an object");
    t.equal(skeleton.id.constructor, BigNumber, "skeleton market ID is a BigNumber");
    t.equal(skeleton.branchId, marketInfo.branchId, "skeleton.branchId == marketInfo.branchId");
    t.false(skeleton.loaded, "skeleton is not loaded");
    t.end();
});

test("addPendingMarket", function (t) {
    t.plan(13);
    var complete = {returned: false, dispatch: false};
    var newMarket = {
        description: "a shiny new market",
        initialLiquidity: 100,
        tradingFee: new BigNumber("0.02")
    };
    MarketActions.dispatch = function (label, payload) {
        t.equal(label, "ADD_PENDING_MARKET_SUCCESS", "dispatch: " + label);
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.market.constructor, Object, "payload.market is an object");
        t.true(payload.market.pending, "payload.market.pending is true");
        t.equal(payload.market.description, newMarket.description, "payload.market.description == input description");
        t.equal(payload.market.initialLiquidity, newMarket.initialLiquidity, "payload.market.initialLiquidity == input initialLiquidity");
        t.equal(payload.market.tradingFee.constructor, BigNumber, "payload.market.tradingFee is a BigNumber");
        t.true(payload.market.tradingFee.eq(newMarket.tradingFee), "payload.market.tradingFee == input tradingFee");
        t.equal(payload.market.id.constructor, String, "payload.market.id is a string");
        t.equal(payload.market.id.slice(0, 8), "pending.", "payload.market.id starts with 'pending.'");
        t.false(newMarket.pending, "input does not have pending field");
        t.false(newMarket.id, "input does not have id field");
        complete.dispatch = true;
        if (complete.dispatch && complete.returned) t.end();
    };
    var marketId = MarketActions.addPendingMarket(_.clone(newMarket));
    t.equal(marketId.constructor, String, "new market ID is a string");
    complete.returned = true;
    if (complete.dispatch && complete.returned) t.end();
});

test("deleteMarket", function (t) {
    t.plan(2);
    var marketId = "pending." + augur.utils.sha256(JSON.stringify({
        description: "a shiny new market",
        initialLiquidity: 100,
        tradingFee: new BigNumber(0.02)
    }));
    MarketActions.dispatch = function (label, payload) {
        t.equal(label, "DELETE_MARKET_SUCCESS", "dispatch: " + label);
        t.equal(payload.marketId.constructor, String, "payload.marketId is a string");
        t.end();
    };
    MarketActions.deleteMarket(marketId);
});

// tradeSucceeded triggers loadMarket(marketId) => repeat loadMarket test
test("tradeSucceeded", function (t) {
    t.plan(3);
    var marketId = marketInfo.id;
    var trade = {
        branchId: augur.branches.dev,
        marketId: marketId,
        outcome: "1",
        oldPrice: new BigNumber("0.5")
    };
    var dispatchCount = 0;
    MarketActions.dispatch = function (label, payload) {
        t.true(validator.isIn(label, ["LOAD_MARKETS_SUCCESS", "MARKETS_LOADING"]), "label is LOAD_MARKETS_SUCCESS or MARKETS_LOADING");
        if (label === "LOAD_MARKETS_SUCCESS") {
            t.equal(payload.markets[marketId].constructor, Object, "payload.markets has marketInfo.id field");
        } else if (label === "MARKETS_LOADING") {
            t.equal(payload.loadingPage, null, "payload.loadingPage is null");
        }
        if (++dispatchCount > 1) t.end();
    };
    MarketActions.tradeSucceeded(trade, marketId);
});

// test("updatePendingShares", function (t) {
//     var outcomeId = "2";
//     var relativeShares = 2;
//     MarketActions.dispatch = function (label, payload) {
//         t.equal(label, "UPDATE_MARKET_SUCCESS", "dispatch: " + label);
//         t.equal(payload.constructor, Object, "payload is an object");
//         t.equal(payload.market.constructor, Object, "payload.market is an object");
//         t.equal(payload.market.id.constructor, BigNumber, "payload.market.id is a BigNumber");
//         t.true(payload.market.id.eq(marketInfo.id), "payload.market.id == input id");
//         t.end();
//     };
//     console.log(marketInfo.outcomes);
//     MarketActions.updatePendingShares(marketInfo, outcomeId, relativeShares);
// });
