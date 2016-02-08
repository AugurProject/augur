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

flux.augur.connect();
var account = {address: flux.augur.from};
var blockNumber = flux.augur.rpc.blockNumber();
marketInfo = parseMarketInfoSync(marketInfo);

test("MarketActions.addComment", function (t) {
    t.plan(5);
    var commentText = "augur's unit tests have something random to say: '" + Math.random().toString(36).substring(4) + "'";
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
        flux.augur.filters.ignore(true, t.end);
    };
    flux.actions.market.addComment(commentText, marketInfo.id, account);
});

test("MarketActions.loadComments", function (t) {
    t.plan(7);
    var numComments = 3;
    var markets = {};
    markets[marketInfo.id] = clone(marketInfo);
    flux.stores.market.state.markets = markets;
    var UPDATE_MARKET_SUCCESS = flux.register.UPDATE_MARKET_SUCCESS;
    flux.register.UPDATE_MARKET_SUCCESS = function (payload) {
        var storedMarketInfo = clone(flux.store("market").getMarket(marketInfo.id));
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.market.constructor, Object, "payload.market is an object");
        t.equal(payload.market.comments.constructor, Array, "payload.market.comments is an array");
        t.true(payload.market.comments.length <= numComments, "payload.market.comments contains at most " + numComments + " comment(s)");
        t.equal(storedMarketInfo.constructor, Object, "storedMarketInfo is an object");
        t.equal(storedMarketInfo.comments, undefined, "storedMarketInfo.comments is undefined");
        storedMarketInfo.comments = clone(payload.market.comments);
        t.equal(JSON.stringify(payload.market), JSON.stringify(storedMarketInfo), "verify payload");
        flux.register.UPDATE_MARKET_SUCCESS = UPDATE_MARKET_SUCCESS;
        t.end();
    };
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
    flux.actions.market.updateComments(message, marketInfo.id, flux.augur.from);
});
