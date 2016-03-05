/**
 * augur unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var test = require("tape");
var clone = require("clone");
var flux = require("./mock");
var reset = require("./reset");

var DEBUG = false;

flux.augur.connect();

test("SearchActions.updateKeywords", function (t) {
    flux = reset(flux);
    var keyword = "be";
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

test("SearchActions.sortMarkets", function (t) {
    flux = reset(flux);
    var sortBy = "creationBlock";
    var INITIAL_LOAD_COMPLETE = flux.register.INITIAL_LOAD_COMPLETE;
    flux.register.INITIAL_LOAD_COMPLETE = function () {
        INITIAL_LOAD_COMPLETE();
        t.pass("dispatch INITIAL_LOAD_COMPLETE");
        flux.actions.search.sortMarkets(sortBy, 0);
    };
    var UPDATE_SORT_BY = flux.register.UPDATE_SORT_BY;
    flux.register.UPDATE_SORT_BY = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.sortBy, sortBy, "payload.sortBy == " + sortBy);
        t.equal(payload.reverse, 0, "payload.reverse == 0");
        UPDATE_SORT_BY(payload);
        t.pass("dispatch UPDATE_SORT_BY");
        t.equal(flux.store("search").getState().sortBy, sortBy, "search.state.sortBy == " + sortBy);
        var markets = flux.store("search").getState().results;
        var prevMarket, count = 0;
        for (var m in markets) {
            if (!markets.hasOwnProperty(m)) continue;
            if (count++) {
                t.true(markets[m][sortBy] >= prevMarket[sortBy], "markets sorted by " + sortBy + ": " + markets[m][sortBy] + " >= " + prevMarket[sortBy]);
            }
            prevMarket = clone(markets[m]);
        }
        flux.register.UPDATE_SORT_BY = function (payload) {
            t.equal(payload.constructor, Object, "payload is an object");
            t.equal(payload.sortBy, sortBy, "payload.sortBy == " + sortBy);
            t.equal(payload.reverse, 1, "payload.reverse == 1");
            UPDATE_SORT_BY(payload);
            t.pass("dispatch UPDATE_SORT_BY");
            t.equal(flux.store("search").getState().sortBy, sortBy, "search.state.sortBy == " + sortBy);
            var markets = flux.store("search").getState().results;
            var prevMarket, count = 0;
            for (var m in markets) {
                if (!markets.hasOwnProperty(m)) continue;
                if (count++) {
                    t.true(markets[m][sortBy] <= prevMarket[sortBy], "markets sorted by " + sortBy + ": " + markets[m][sortBy] + " <= " + prevMarket[sortBy]);
                }
                prevMarket = clone(markets[m]);
            }
            flux.register.INITIAL_LOAD_COMPLETE = INITIAL_LOAD_COMPLETE;
            flux.register.UPDATE_SORT_BY = UPDATE_SORT_BY;
            t.end();
        };
        flux.actions.search.sortMarkets(sortBy, 1);
    };
    flux.actions.market.loadMarkets();
});
