/**
 * augur unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var test = require("tape");
var keys = require("keythereum");
var BigNumber = require("bignumber.js");
var clone = require("clone");
var valid = require("validator");
var utils = require("../app/libs/utilities");
var flux = require("./mock");
var keystore = require("./account");
var marketInfo = require("./marketInfo");

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

var account = {address: flux.augur.rpc.coinbase()};
var blockNumber = flux.augur.rpc.blockNumber();
marketInfo = parseMarketInfoSync(marketInfo);

test("MarketActions.addComment", function (t) {
    var commentText = "augur's unit tests have something random to say: '" + Math.random().toString(36).substring(4) + "'";
    var markets = {};
    markets[marketInfo.id] = clone(marketInfo);
    flux.stores.market.state.markets = markets;
    var SET_IS_HOSTED = flux.register.SET_IS_HOSTED;
    var UPDATE_ETHEREUM_STATUS = flux.register.UPDATE_ETHEREUM_STATUS;
    var UPDATE_PERCENT_LOADED_SUCCESS = flux.register.UPDATE_PERCENT_LOADED_SUCCESS;
    var FILTER_SETUP_COMPLETE = flux.register.FILTER_SETUP_COMPLETE;
    var UPDATE_MARKET_SUCCESS = flux.register.UPDATE_MARKET_SUCCESS;
    var COMMENT_SAVED = flux.register.COMMENT_SAVED;
    var FILTER_TEARDOWN_COMPLETE = flux.register.FILTER_TEARDOWN_COMPLETE;
    var isHosted = true;
    var expectedStatusSequence = ["ETHEREUM_STATUS_CONNECTED", "ETHEREUM_STATUS_NO_ACCOUNT"];
    expectedStatusSequence.reverse();
    flux.register.SET_IS_HOSTED = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.isHosted, isHosted, "payload.isHosted == " + isHosted);
        SET_IS_HOSTED(payload);
        t.pass("dispatch SET_IS_HOSTED");
        t.equal(flux.store("config").getState().isHosted, isHosted, "config.state.isHosted == " + isHosted);
    };
    flux.register.UPDATE_ETHEREUM_STATUS = function (payload) {
        var expectedStatus = expectedStatusSequence.pop();
        t.equal(payload.ethereumStatus, expectedStatus, "payload.ethereumStatus == " + expectedStatus);
        UPDATE_ETHEREUM_STATUS(payload);
        t.pass("dispatch UPDATE_ETHEREUM_STATUS");
        t.equal(flux.store("network").getState().ethereumStatus, expectedStatus, "network.state.ethereumStatus == " + expectedStatus);
    };
    flux.register.UPDATE_PERCENT_LOADED_SUCCESS = function (payload) {
        t.true(payload.percentLoaded > 0, "payload.percentLoaded > 0");
        t.true(payload.percentLoaded <= 100, "payload.percentLoaded <= 100");
        flux.register.UPDATE_ETHEREUM_STATUS = UPDATE_ETHEREUM_STATUS;
        flux.register.UPDATE_PERCENT_LOADED_SUCCESS = UPDATE_PERCENT_LOADED_SUCCESS;
        UPDATE_PERCENT_LOADED_SUCCESS(payload);
        t.pass("dispatch UPDATE_PERCENT_LOADED_SUCCESS");
        t.equal(flux.store("config").getState().percentLoaded, payload.percentLoaded, "config.state.percentLoaded == payload.percentLoaded");
    };
    flux.register.FILTER_SETUP_COMPLETE = function (payload) {
        t.true(flux.augur.filters.price_filter.id !== null, "price_filter.id is not null");
        t.true(flux.augur.filters.contracts_filter.id !== null, "contracts_filter.id is not null");
        t.true(flux.augur.filters.block_filter.id !== null, "block_filter.id is not null");
        t.true(flux.augur.filters.creation_filter.id !== null, "creation_filter.id is not null");
        t.true(flux.augur.filters.price_filter.heartbeat !== null, "price_filter.heartbeat is not null");
        t.true(flux.augur.filters.contracts_filter.heartbeat !== null, "contracts_filter.heartbeat is not null");
        t.true(flux.augur.filters.block_filter.heartbeat !== null, "block_filter.heartbeat is not null");
        t.true(flux.augur.filters.creation_filter.heartbeat !== null, "creation_filter.heartbeat is not null");
        FILTER_SETUP_COMPLETE(payload);
        t.pass("dispatch FILTER_SETUP_COMPLETE");
        var storedFilters = flux.store("config").getState().filters;
        console.log("storedFilters:", storedFilters);
        t.equal(Object.keys(storedFilters).length, 4, "config.state has 4 filters");
        var filterId;
        for (var f in storedFilters) {
            if (!storedFilters.hasOwnProperty(f)) continue;
            filterId = storedFilters[f].replace("0x", "");
            t.true(valid.isHexadecimal(filterId), "config.state." + f + " has a valid hex ID");
        }
        flux.actions.market.addComment(commentText, marketInfo.id, account);
    };
    var checkbox = {update: false, saved: false};
    flux.register.UPDATE_MARKET_SUCCESS = function (payload) {
        var storedMarketInfo = flux.store("market").getMarket(marketInfo.id);
        t.equal(payload.market.constructor, Object, "payload.market is an object");
        t.equal(payload.market.comments.constructor, Array, "payload.market.comments is an array");
        t.true(payload.market.comments.length, "payload.market.comments contains at least one comment");
        if (!storedMarketInfo.comments) storedMarketInfo.comments = [];
        t.equal(payload.market.comments.length, storedMarketInfo.comments.length + 1, "payload.market.comments contains one more comment than MarketStore");
        var comment = payload.market.comments[0];
        var marketInfoWithComment = clone(storedMarketInfo);
        marketInfoWithComment.comments.push(comment);
        t.equal(JSON.stringify(payload.market), JSON.stringify(marketInfoWithComment), "verify payload");
        flux.actions.config.teardownFilters();
    };
    flux.register.FILTER_TEARDOWN_COMPLETE = function () {
        FILTER_TEARDOWN_COMPLETE();
        t.pass("dispatch FILTER_TEARDOWN_COMPLETE");
        t.equal(Object.keys(flux.store("config").getState().filters).length, 0, "config.state.filters == {}");
        t.true(flux.augur.filters.price_filter.id === null, "price_filter.id is null");
        t.true(flux.augur.filters.contracts_filter.id === null, "contracts_filter.id is null");
        t.true(flux.augur.filters.block_filter.id === null, "block_filter.id is null");
        t.true(flux.augur.filters.creation_filter.id === null, "creation_filter.id is null");
        t.true(flux.augur.filters.price_filter.heartbeat === null, "price_filter.heartbeat is null");
        t.true(flux.augur.filters.contracts_filter.heartbeat === null, "contracts_filter.heartbeat is null");
        t.true(flux.augur.filters.block_filter.heartbeat === null, "block_filter.heartbeat is null");
        t.true(flux.augur.filters.creation_filter.heartbeat === null, "creation_filter.heartbeat is null");
    };
    flux.register.COMMENT_SAVED = function (payload) {
        COMMENT_SAVED(payload);
        t.pass("dispatch COMMENT_SAVED");
        flux.register.SET_IS_HOSTED = SET_IS_HOSTED;
        flux.register.UPDATE_ETHEREUM_STATUS = UPDATE_ETHEREUM_STATUS;
        flux.register.UPDATE_PERCENT_LOADED_SUCCESS = UPDATE_PERCENT_LOADED_SUCCESS;
        flux.register.FILTER_SETUP_COMPLETE = FILTER_SETUP_COMPLETE;
        flux.register.UPDATE_MARKET_SUCCESS = UPDATE_MARKET_SUCCESS;
        flux.register.COMMENT_SAVED = COMMENT_SAVED;
        flux.register.FILTER_TEARDOWN_COMPLETE = FILTER_TEARDOWN_COMPLETE;
        t.end();
    };
    flux.actions.config.connect(true);
});

test("MarketActions.loadComments", function (t) {
    t.plan(7);
    var numComments = 3;
    var markets = {};
    markets[marketInfo.id] = clone(marketInfo);
    flux.stores.market.state.markets = markets;
    var UPDATE_MARKET_SUCCESS = flux.register.UPDATE_MARKET_SUCCESS;
    flux.register.UPDATE_MARKET_SUCCESS = function (payload) {
        console.log(payload);
        var storedMarketInfo = clone(flux.store("market").getMarket(marketInfo.id));
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.market.constructor, Object, "payload.market is an object");
        t.equal(payload.market.comments.constructor, Array, "payload.market.comments is an array");
        t.true(payload.market.comments.length <= numComments, "payload.market.comments contains at most " + numComments + " comment(s)");
        t.equal(storedMarketInfo.constructor, Object, "storedMarketInfo is an object");
        t.equal(storedMarketInfo.comments, undefined, "storedMarketInfo.comments is undefined");
        storedMarketInfo.comments = clone(payload.market.comments);
        // delete storedMarketInfo.creationBlock;
        // delete storedMarketInfo.creationDate;
        // delete storedMarketInfo.events;
        // delete payload.market.events;
        t.equal(JSON.stringify(payload.market), JSON.stringify(storedMarketInfo), "verify payload");
        flux.register.UPDATE_MARKET_SUCCESS = UPDATE_MARKET_SUCCESS;
        t.end();
    };
    flux.augur.rpc.useHostedNode();
    flux.actions.market.loadComments(clone(marketInfo), {numComments: numComments});
});

test("MarketActions.updateComments", function (t) {
    t.plan(5);
    var message = "augur's unit tests have something random to say: '" + Math.random().toString(36).substring(4) + "'";
    var markets = {};
    markets[marketInfo.id] = clone(marketInfo);
    flux.stores.market.state.markets = markets;
    var UPDATE_MARKET_SUCCESS = flux.register.UPDATE_MARKET_SUCCESS;
    flux.register.UPDATE_MARKET_SUCCESS = function (payload) {
        var storedMarketInfo = flux.store("market").getMarket(marketInfo.id);
        t.equal(payload.market.constructor, Object, "payload.market is an object");
        t.equal(payload.market.comments.constructor, Array, "payload.market.comments is an array");
        t.true(payload.market.comments.length, "payload.market.comments contains at least one comment");
        if (!storedMarketInfo.comments) storedMarketInfo.comments = [];
        t.equal(payload.market.comments.length, storedMarketInfo.comments.length + 1, "payload.market.comments contains one more comment than MarketStore");
        var comment = payload.market.comments[0];
        var marketInfoWithComment = clone(storedMarketInfo);
        marketInfoWithComment.comments.push(comment);
        t.equal(JSON.stringify(payload.market), JSON.stringify(marketInfoWithComment), "verify payload");
        flux.register.UPDATE_MARKET_SUCCESS = UPDATE_MARKET_SUCCESS;
        t.end();
    };
    flux.actions.market.updateComments(message, marketInfo.id, account);
});
