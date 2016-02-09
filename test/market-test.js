/**
 * augur unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var test = require("tape");
var abi = require("augur-abi");
var _ = require("lodash");
var BigNumber = require("bignumber.js");
var clone = require("clone");
var validator = require("validator");
var moment = require("moment");
var utils = require("../app/libs/utilities");
var constants = require("../app/libs/constants");
var flux = require("./mock");

function parseMarketInfoSync(info) {
    info.id = new BigNumber(info._id);
    info.endDate = utils.blockToDate(info.endDate, blockNumber);
    info.creationBlock = utils.blockToDate(info.creationBlock, blockNumber)
    info.price = new BigNumber(info.price);
    info.tradingFee = new BigNumber(info.tradingFee);
    info.creationFee = new BigNumber(info.creationFee);
    info.traderCount = new BigNumber(info.traderCount);
    info.alpha = new BigNumber(info.alpha);
    info.tradingPeriod = new BigNumber(info.tradingPeriod);
    var traderId = info.participants[account.address];
    if (traderId) info.traderId = new BigNumber(traderId);
    for (var i = 0; i < info.numEvents; ++i) {
        info.events[i].endDate = utils.blockToDate(info.events[i].endDate);
    }
    for (i = 0; i < info.numOutcomes; ++i) {
        if (info.outcomes[i].outstandingShares) {
            info.outcomes[i].outstandingShares = new BigNumber(info.outcomes[i].outstandingShares);
        } else {
            info.outcomes[i].outstandingShares = new BigNumber(0);
        }
        if (info.outcomes[i].shares[account.address]) {
            info.outcomes[i].sharesHeld = new BigNumber(info.outcomes[i].shares[account.address]);
        } else {
            info.outcomes[i].sharesHeld = new BigNumber(0);
        }
        info.outcomes[i].pendingShares = new BigNumber(0);
        info.outcomes[i].price = new BigNumber(info.outcomes[i].price);
    }
    info.loaded = true;
    return info;
}

// var host = "http://127.0.0.1:8545";
// flux.augur.rpc.setLocalNode(host);
// flux.augur.connect(host, process.env.GETH_IPC);
flux.augur.connect();
var account = {address: flux.augur.from};
var blockNumber = flux.augur.rpc.blockNumber();
var marketsInfo = flux.augur.getMarketsInfo(flux.augur.branches.dev);
var marketInfo;
for (var m in marketsInfo) {
    if (!marketsInfo.hasOwnProperty(m)) continue;
    if (marketsInfo[m].type !== "combinatorial") {
        marketInfo = marketsInfo[m];
        break;
    }
}
var rawInfo = clone(marketInfo);
marketInfo = parseMarketInfoSync(marketInfo);

test("marketInfo", function (t) {
    var market = rawInfo._id;
    t.false(rawInfo.id, "raw marketInfo's id field is unassigned");
    t.true(validator.isHexadecimal(abi.unfork(rawInfo._id)), "unfork(_id) is valid hex");
    t.true(validator.isNumeric(rawInfo.network), "network is numeric");
    t.true(validator.isIn(rawInfo.network, ["7", "10101"]), "network is 7 or 10101");
    t.true(validator.isInt(rawInfo.traderCount.toString()), "traderCount is an integer");
    t.true(rawInfo.traderIndex > -1, "traderIndex > -1");
    t.equal(rawInfo.alpha, "0.00790000000000000001", "alpha == 0.00790000000000000001");
    t.true(validator.isInt(rawInfo.tradingPeriod.toString()), "tradingPeriod is an integer");
    t.true(validator.isFloat(rawInfo.tradingFee), "tradingFee is a float");
    t.true(rawInfo.tradingFee > 0, "tradingFee > 0");
    t.true(rawInfo.tradingFee <= 1, "tradingFee <= 1");
    t.true(validator.isHexadecimal(abi.unfork(rawInfo.branchId)), "unfork(branchId) is valid hex");
    t.true(validator.isInt(rawInfo.numEvents.toString()), "numEvents is an integer");
    t.true(rawInfo.numEvents >= 1, "numEvents >= 1");
    t.true(validator.isInt(rawInfo.cumulativeScale), "cumulativeScale is a (string) integer");
    t.true(validator.isInt(rawInfo.creationFee), "creationFee is a (string) integer");
    t.true(Number(rawInfo.creationFee) > 0, "Number(creationFee) > 0");
    t.true(validator.isHexadecimal(abi.unfork(rawInfo.author)), "unfork(author) is valid hex");
    t.true(validator.isInt(rawInfo.endDate.toString()), "endDate is an integer");
    t.equal(rawInfo.participants.constructor, Object, "participants is an object");
    t.true(Object.keys(rawInfo.participants).length >= 0, "number of participants >= 0");
    t.true(validator.isInt(rawInfo.numOutcomes), "numOutcomes is an integer");
    t.true(rawInfo.numOutcomes > 1, "numOutcomes > 1");
    t.equal(rawInfo.outcomes.constructor, Array, "outcomes is an array");
    t.equal(rawInfo.numOutcomes, rawInfo.outcomes.length, "numOutcomes == outcomes.length");
    var outcome;
    for (var i = 0; i < rawInfo.numOutcomes; ++i) {
        outcome = rawInfo.outcomes[i];
        t.equal(outcome.constructor, Object, "outcome is an object");
        t.true(validator.isInt(outcome.id.toString()), "outcome.id is an integer");
        t.true(outcome.id > 0, "outcome.id > 0");
        t.true(validator.isFloat(outcome.outstandingShares), "outcome.outstandingShares is a (string) float");
        t.true(parseFloat(outcome.outstandingShares) > 0, "outcome.outstandingShares > 0");
        t.true(validator.isFloat(outcome.price), "outcome.price is a (string) float");
        t.equal(outcome.shares.constructor, Object, "outcome.shares is an object");
        t.true(Object.keys(outcome.shares).length >= 0, "number of share holders >= 0");
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
        t.true(validator.isInt(event.endDate.toString()), "event.endDate is an integer");
        t.true(event.endDate > 0, "event.endDate > 0");
        t.true(validator.isInt(event.outcome), "event.outcome is a (string) integer");
        t.true(parseInt(event.outcome) >= 0, "event.outcome >= 0");
        t.true(validator.isInt(event.minValue), "event.minValue is a (string) integer");
        t.true(validator.isInt(event.maxValue), "event.maxValue is a (string) integer");
        t.true(parseInt(event.minValue) < parseInt(event.maxValue), "event.minValue < event.maxValue");
        t.true(validator.isInt(event.numOutcomes.toString()), "event.numOutcomes is an integer");
        t.true(event.numOutcomes > 1, "event.numOutcomes > 1");
    }
    t.end();
});

test("MarketActions.parseMarketInfo", function (t) {
    t.plan(18);
    var info = clone(rawInfo);
    flux.actions.market.parseMarketInfo(clone(info), function (parsedInfo) {
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
        t.true(moment.isMoment(parsedInfo.endDate), "parsed marketInfo.endDate is a Moment");
        t.end();
    });
});

test("MarketActions.loadMarkets", function (t) {
    var dispatchCount = 0;
    var LOAD_MARKETS_SUCCESS = flux.register.LOAD_MARKETS_SUCCESS;
    var MARKETS_LOADING = flux.register.MARKETS_LOADING;
    flux.register.LOAD_MARKETS_SUCCESS = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.markets.constructor, Object, "payload.markets is an object");
        t.equal(payload.markets[marketInfo.id].constructor, Object, "payload.markets has marketInfo.id field");
        t.true(Object.keys(payload.markets).length > 0, "payload.markets has at least 1 key");
        if (++dispatchCount > 1) {
            flux.register.LOAD_MARKETS_SUCCESS = LOAD_MARKETS_SUCCESS;
            flux.register.MARKETS_LOADING = MARKETS_LOADING;
            t.end();
        }
    };
    flux.register.MARKETS_LOADING = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.loadingPage, null, "payload.loadingPage is null");
        if (++dispatchCount > 1) {
            flux.register.LOAD_MARKETS_SUCCESS = LOAD_MARKETS_SUCCESS;
            flux.register.MARKETS_LOADING = MARKETS_LOADING;
            t.end();
        }
    };
    flux.actions.market.loadMarkets();
});

test("MarketActions.loadMarket", function (t) {
    var dispatchCount = 0;
    var LOAD_MARKETS_SUCCESS = flux.register.LOAD_MARKETS_SUCCESS;
    var MARKETS_LOADING = flux.register.MARKETS_LOADING;
    flux.register.LOAD_MARKETS_SUCCESS = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.markets.constructor, Object, "payload.markets is an object");
        t.equal(payload.markets[marketInfo.id].constructor, Object, "payload.markets has marketInfo.id field");
        if (++dispatchCount > 1) {
            flux.register.LOAD_MARKETS_SUCCESS = LOAD_MARKETS_SUCCESS;
            flux.register.MARKETS_LOADING = MARKETS_LOADING;
            t.end();
        }
    };
    flux.register.MARKETS_LOADING = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.loadingPage, null, "payload.loadingPage is null");
        if (++dispatchCount > 1) {
            flux.register.LOAD_MARKETS_SUCCESS = LOAD_MARKETS_SUCCESS;
            flux.register.MARKETS_LOADING = MARKETS_LOADING;
            t.end();
        }
    };
    flux.actions.market.loadMarket(marketInfo.id);
});

test("MarketActions.initMarket", function (t) {
    t.plan(4);
    var skeleton = flux.actions.market.initMarket(marketInfo.id);
    t.equal(skeleton.constructor, Object, "skeleton is an object");
    t.equal(skeleton.id.constructor, BigNumber, "skeleton market ID is a BigNumber");
    t.equal(abi.number(skeleton.branchId), abi.number(marketInfo.branchId), "number(skeleton.branchId) == number(marketInfo.branchId)");
    t.false(skeleton.loaded, "skeleton is not loaded");
    t.end();
});

test("MarketActions.addPendingMarket", function (t) {
    t.plan(12);
    var complete = {returned: false, dispatch: false};
    var newMarket = {
        description: "a shiny new market",
        initialLiquidity: 100,
        tradingFee: new BigNumber("0.02")
    };
    var ADD_PENDING_MARKET_SUCCESS = flux.register.ADD_PENDING_MARKET_SUCCESS;
    flux.register.ADD_PENDING_MARKET_SUCCESS = function (payload) {
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
        if (complete.dispatch && complete.returned) {
            flux.register.ADD_PENDING_MARKET_SUCCESS = ADD_PENDING_MARKET_SUCCESS;
            t.end();
        }
    };
    var marketId = flux.actions.market.addPendingMarket(clone(newMarket));
    t.equal(marketId.constructor, String, "new market ID is a string");
    complete.returned = true;
    if (complete.dispatch && complete.returned) {
        flux.register.ADD_PENDING_MARKET_SUCCESS = ADD_PENDING_MARKET_SUCCESS;
        t.end();
    }
});

test("MarketActions.deleteMarket", function (t) {
    t.plan(2);
    var marketId = "pending." + flux.augur.utils.sha256(JSON.stringify({
        description: "a shiny new market",
        initialLiquidity: 100,
        tradingFee: new BigNumber(0.02)
    }));
    var DELETE_MARKET_SUCCESS = flux.register.DELETE_MARKET_SUCCESS;
    flux.register.DELETE_MARKET_SUCCESS = function (payload) {
        t.equal(payload.marketId.constructor, String, "payload.marketId is a string");
        t.equal(payload.marketId, marketId, "payload.marketId == input marketId");
        t.end();
    };
    flux.actions.market.deleteMarket(marketId);
});

// tradeSucceeded triggers loadMarket(marketId) => repeat loadMarket test
test("MarketActions.tradeSucceeded", function (t) {
    t.plan(2);
    var marketId = marketInfo.id;
    var trade = {
        branchId: process.env.AUGUR_BRANCH_ID || "1010101",
        marketId: marketId,
        outcome: "1",
        oldPrice: new BigNumber("0.5")
    };
    var dispatchCount = 0;
    var MARKETS_LOADING = flux.register.MARKETS_LOADING;
    var LOAD_MARKETS_SUCCESS = flux.register.LOAD_MARKETS_SUCCESS;
    flux.register.MARKETS_LOADING = function (payload) {
        t.equal(payload.loadingPage, null, "payload.loadingPage is null");
        if (++dispatchCount > 1) {
            flux.register.MARKETS_LOADING = MARKETS_LOADING;
            flux.register.LOAD_MARKETS_SUCCESS = LOAD_MARKETS_SUCCESS;
            t.end();
        }
    };
    flux.register.LOAD_MARKETS_SUCCESS = function (payload) {
        t.equal(payload.markets[marketId].constructor, Object, "payload.markets has marketInfo.id field");
        if (++dispatchCount > 1) {
            flux.register.MARKETS_LOADING = MARKETS_LOADING;
            flux.register.LOAD_MARKETS_SUCCESS = LOAD_MARKETS_SUCCESS;
            t.end();
        }
    };
    flux.actions.market.tradeSucceeded(trade, marketId);
});

test("MarketActions.updatePendingShares", function (t) {
    t.plan(5);
    var outcomeId = 2;
    var relativeShares = 2;
    var UPDATE_MARKET_SUCCESS = flux.register.UPDATE_MARKET_SUCCESS;
    flux.register.UPDATE_MARKET_SUCCESS = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.market.constructor, Object, "payload.market is an object");
        t.equal(payload.market.id.constructor, BigNumber, "payload.market.id is a BigNumber");
        t.true(payload.market.id.eq(marketInfo.id), "payload.market.id == input id");
        t.true(marketInfo.outcomes[outcomeId - 1].pendingShares.plus(new BigNumber(relativeShares)).eq(payload.market.outcomes[outcomeId - 1].pendingShares), "after outcome pendingShares == before outcome pendingShares + signed trade");
        flux.register.UPDATE_MARKET_SUCCESS = UPDATE_MARKET_SUCCESS;
        flux.augur.filters.ignore(true, t.end);
    };
    flux.actions.market.updatePendingShares(clone(marketInfo), outcomeId, relativeShares);
});

test("MarketActions.updateOrders", function (t) {
    t.plan(5);
    var orders = {
      "-0xe2ec88f924edae71b14c95d751538387e3c43e400bde53ad7aa686baa3985fca": {
        "1": [{
            "price": "0.25",
            "amount": "1.2",
            "expiration": 100,
            "cap": 10,
            "timestamp": 1454576803024,
            "id": "0x1ff4b363af792bf331f0f6eaac34a0793dc6654ae5a96bd0f0c21a15e5d1d690"
        }],
        "2": [{
            "price": "0.75",
            "amount": "0.2",
            "expiration": 0,
            "cap": 10,
            "timestamp": 1454576803022,
            "id": "-0x65e2a71065f6bcceb7d8041de8811ce16525fe4946c3374fc82efaaf1e62f8e2"
        }]
      }
    };
    var UPDATE_ORDERS_SUCCESS = flux.register.UPDATE_ORDERS_SUCCESS;
    flux.register.UPDATE_ORDERS_SUCCESS = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.orders.constructor, Object, "payload.orders is an object");
        t.deepEqual(payload.orders, orders, "payload.orders == input orders");
        UPDATE_ORDERS_SUCCESS(payload);
        t.pass("dispatch UPDATE_ORDERS_SUCCESS");
        flux.register.UPDATE_ORDERS_SUCCESS = UPDATE_ORDERS_SUCCESS;
        t.deepEqual(flux.store("market").getOrders(), orders, "stores.market.orders == input orders");
        t.end();
    };
    flux.actions.market.updateOrders(orders);
});
