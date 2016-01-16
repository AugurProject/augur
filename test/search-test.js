/**
 * augur unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var test = require("tape");
var constants = require("../app/libs/constants");
var flux = require("./mock");

var DEBUG = false;
// var host = "http://127.0.0.1:8545";
// flux.augur.rpc.setLocalNode(host);
// flux.augur.connect(host);
flux.augur.connect();
flux.augur.connector.from = flux.augur.coinbase;
flux.augur.sync(flux.augur.connector);

test("SearchActions.updateKeywords", function (t) {
    var keyword = "rain";
    var LOAD_MARKETS_SUCCESS = flux.register.LOAD_MARKETS_SUCCESS;
    var KEYWORDS_UPDATED = flux.register.KEYWORDS_UPDATED;
    flux.register.LOAD_MARKETS_SUCCESS = function (payload) {
        var numMarkets = Object.keys(payload.markets).length;
        t.true(numMarkets > 0, "payload.markets has at least 1 key");
        LOAD_MARKETS_SUCCESS(payload);
        t.pass("dispatch LOAD_MARKETS_SUCCESS");
        var storedMarkets = flux.store("market").getState().markets;
        t.equal(Object.keys(storedMarkets).length, numMarkets, "market.state.markets has the same number of keys as payload.markets");
        t.deepEqual(storedMarkets, payload.markets, "market.state.markets == payload.markets");
        flux.actions.search.updateKeywords(keyword);
    };
    flux.register.KEYWORDS_UPDATED = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.keywords, keyword, "payload.keywords == " + keyword);
        KEYWORDS_UPDATED(payload);
        t.pass("dispatch KEYWORDS_UPDATED");
        var state = flux.store("search").getState();
        t.equal(state.keywords, payload.keywords, "search.state.keywords == payload.keywords");
        t.deepEqual(state.cleanKeywords, [payload.keywords], "state.cleanKeywords == [payload.keywords]");
        t.true(Object.keys(state.markets).length, "search.state.markets is not empty");
        t.true(Object.keys(state.results).length, "search.state.results is not empty");
        flux.register.LOAD_MARKETS_SUCCESS = LOAD_MARKETS_SUCCESS;
        flux.register.KEYWORDS_UPDATED = KEYWORDS_UPDATED;
        t.end();
    };
    var initialState = flux.store("search").getState();
    t.equal(initialState.keywords, "", "initial search.state.keywords == ''");
    t.equal(initialState.cleanKeywords.constructor, Array, "initial search.state.cleanKeywords is an array");
    t.equal(initialState.cleanKeywords.length, 0, "initial search.state.cleanKeywords == []");
    t.equal(Object.keys(initialState.markets).length, 0, "initial search.state.markets == {}");
    t.equal(Object.keys(initialState.results).length, 0, "initial search.state.results == {}");
    flux.actions.market.loadMarkets();
});
