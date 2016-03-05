/**
 * augur unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var test = require("tape");
var abi = require("augur-abi");
var BigNumber = require("bignumber.js");
var flux = require("./mock");

var DEBUG = false;

// var host = "http://127.0.0.1:8545";
// flux.augur.rpc.setLocalNode(host);
// flux.augur.rpc.nodes.hosted = [];
// flux.augur.connect(host, process.env.GETH_IPC);
flux.augur.connect();

test("AssetActions.loadMeanTradePrices", function (t) {
    var LOAD_MEAN_TRADE_PRICES_SUCCESS = flux.register.LOAD_MEAN_TRADE_PRICES_SUCCESS;
    flux.register.LOAD_MEAN_TRADE_PRICES_SUCCESS = function (payload) {
        for (var bs in payload.meanTradePrices) {
            if (!payload.meanTradePrices.hasOwnProperty(bs)) continue;
            for (var marketId in payload.meanTradePrices[bs]) {
                if (!payload.meanTradePrices[bs].hasOwnProperty(marketId)) continue;
                for (var outcomeId in payload.meanTradePrices[bs][marketId]) {
                    if (!payload.meanTradePrices[bs][marketId].hasOwnProperty(outcomeId)) continue;
                    t.true(abi.number(payload.meanTradePrices[bs][marketId][outcomeId]) > 0, bs + " " + marketId + " " + outcomeId + " mean price > 0");
                }
            }
        }
        LOAD_MEAN_TRADE_PRICES_SUCCESS(payload);
        t.pass("dispatch LOAD_MEAN_TRADE_PRICES_SUCCESS");
        var meanTradePrices = flux.store("asset").getState().meanTradePrices;
        t.deepEqual(payload.meanTradePrices, meanTradePrices, "payload.meanTradePrices == asset.state.meanTradePrices");
        flux.register.LOAD_MEAN_TRADE_PRICES_SUCCESS = LOAD_MEAN_TRADE_PRICES_SUCCESS;
        if (!flux.augur.filters.price_filter.id) return t.end();
        flux.augur.filters.ignore(true, t.end);
    };
    flux.stores.config.state.currentAccount = "0xaff9cb4dcb19d13b84761c040c91d21dc6c991ec";
    flux.actions.asset.loadMeanTradePrices();
});

test("AssetActions.updateAssets", function (t) {
    t.plan(16);
    var assets = {reputation: null, cash: null, ether: null};
    function done() {
        flux.register.UPDATE_ASSETS = UPDATE_ASSETS;
        t.pass("reset flux.register");
        flux.actions.config.signOut();
        var configState = flux.store("config").getState();
        t.equal(configState.currentAccount, null, "store.config.state.currentAccount == null");
        t.equal(configState.privateKey, null, "store.config.state.privateKey == null");
        t.equal(configState.handle, null, "store.config.state.handle == null");
        t.equal(configState.keystore, null, "store.config.state.keystore == null");
        flux.augur.connector.from = flux.augur.coinbase;
        flux.augur.connect();
        t.equal(flux.augur.coinbase, flux.augur.connector.from, "augur.coinbase == augur.connector.from");
        t.equal(flux.augur.coinbase, flux.augur.from, "augur.coinbase == augur.from");
        t.end();
    }
    var UPDATE_ASSETS = flux.register.UPDATE_ASSETS;
    flux.register.UPDATE_ASSETS = function (payload) {
        if (DEBUG) console.log("UPDATE_ASSETS payload:", payload);
        t.equal(payload.constructor, Object, "payload is an object");
        t.true(payload.cash || payload.reputation || payload.ether, "payload fields are not all null");
        if (payload.reputation) {
            t.equal(payload.reputation.constructor, BigNumber, "payload.reputation is a BigNumber");
            assets.reputation = true;
            if (assets.cash && assets.ether) done();
        } else if (payload.cash) {
            t.equal(payload.cash.constructor, BigNumber, "payload.cash is a BigNumber");
            assets.cash = true;
            if (assets.reputation && assets.ether) done();
        } else if (payload.ether) {
            t.equal(payload.ether.constructor, BigNumber, "payload.ether is a BigNumber");
            assets.ether = true;
            if (assets.cash && assets.reputation) done();
        }
    }
    flux.stores.config.state.currentAccount = "0xaff9cb4dcb19d13b84761c040c91d21dc6c991ec";
    flux.stores.asset.state.cash = null;
    flux.stores.asset.state.reputation = null;
    flux.stores.asset.state.ether = null;
    flux.actions.asset.updateAssets();
});
