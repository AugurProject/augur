/**
 * augur unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var test = require("tape");
var abi = require("augur-abi");
var BigNumber = require("bignumber.js");
var clone = require("clone");
var validator = require("validator");
var moment = require("moment");
var utils = require("../app/libs/utilities");
var constants = require("../app/libs/constants");
var flux = require("./mock");

// var host = "http://127.0.0.1:8545";
// flux.augur.rpc.setLocalNode(host);
// flux.augur.connect(host);
flux.augur.connect();
flux.augur.rpc.balancer = false;

test("NetworkActions.checkNetwork", function (t) {
    flux.stores.config.state = {
        host: true,
        currentAccount: null,
        privateKey: null,
        handle: null,
        keystore: null,
        debug: false,
        loaded: false,
        isHosted: isHosted,
        percentLoaded: null,
        filters: {},
        isNewRegistration: false
    };
    flux.stores.network.state = {
        peerCount: null,
        blockNumber: null,
        blocktime: null,
        ether: null,
        gasPrice: null,
        ethereumStatus: null,
        mining: null,
        hashrate: null,
        clientVersion: null,
        networkId: null,
        blockchainAge: null,
        isMonitoringBlocks: false,
        hasCheckedQuorum: false
    };
    flux.stores.market.state = {
        markets: {},
        pendingMarkets: {},
        orders: {},
        marketLoadingIds: null,
        loadingPage: null,
        marketsPerPage: constants.MARKETS_PER_PAGE
    };
    var expectedStatusSequence = ["ETHEREUM_STATUS_CONNECTED", "ETHEREUM_STATUS_NO_ACCOUNT"];
    expectedStatusSequence.reverse();
    var UPDATE_ETHEREUM_STATUS = flux.register.UPDATE_ETHEREUM_STATUS;
    flux.register.UPDATE_ETHEREUM_STATUS = function (payload) {
        var expectedStatus = expectedStatusSequence.pop();
        t.equal(payload.ethereumStatus, expectedStatus, "payload.ethereumStatus == " + expectedStatus);
        UPDATE_ETHEREUM_STATUS(payload);
    };
    var UPDATE_PERCENT_LOADED_SUCCESS = flux.register.UPDATE_PERCENT_LOADED_SUCCESS;
    flux.register.UPDATE_PERCENT_LOADED_SUCCESS = function (payload) {
        t.true(payload.percentLoaded > 0, "payload.percentLoaded > 0");
        t.true(payload.percentLoaded <= 100, "payload.percentLoaded <= 100");
        flux.register.UPDATE_ETHEREUM_STATUS = UPDATE_ETHEREUM_STATUS;
        flux.register.UPDATE_PERCENT_LOADED_SUCCESS = UPDATE_PERCENT_LOADED_SUCCESS;
        flux.augur.filters.ignore(true, t.end);
    };
    t.equal(flux.store("network").getState().ethereumStatus, null, "network state.ethereumStatus is null");
    flux.actions.network.checkNetwork();
});

test("NetworkActions.initializeNetwork", function (t) {
    t.plan(3);
    var UPDATE_ETHEREUM_STATUS = flux.register.UPDATE_ETHEREUM_STATUS;
    flux.register.UPDATE_ETHEREUM_STATUS = function (payload) {
        var expectedStatus = ["ETHEREUM_STATUS_CONNECTED", "ETHEREUM_STATUS_NO_ACCOUNT"];
        t.true(validator.isIn(payload.ethereumStatus, expectedStatus), "payload.ethereumStatus in " + expectedStatus.join(", "));
        UPDATE_ETHEREUM_STATUS(payload);
    };
    var UPDATE_BLOCKCHAIN_AGE = flux.register.UPDATE_BLOCKCHAIN_AGE;
    flux.register.UPDATE_BLOCKCHAIN_AGE = function (payload) {
        t.true(validator.isInt(payload.blockchainAge.toString()), "payload.blockchainAge is a (string) integer");
        UPDATE_BLOCKCHAIN_AGE(payload);
        t.equal(payload.blockchainAge, flux.store("network").getState().blockchainAge, "payload.blockchainAge == state.blockchainAge");
        flux.register.UPDATE_ETHEREUM_STATUS = UPDATE_ETHEREUM_STATUS;
        flux.register.UPDATE_BLOCKCHAIN_AGE = UPDATE_BLOCKCHAIN_AGE;
        t.end();
    };
    flux.actions.network.initializeNetwork();
});

test("NetworkActions.updateNetwork", function (t) {
    t.plan(2);
    var UPDATE_BLOCKCHAIN_AGE = flux.register.UPDATE_BLOCKCHAIN_AGE;
    flux.register.UPDATE_BLOCKCHAIN_AGE = function (payload) {
        t.true(validator.isInt(payload.blockchainAge.toString()), "payload.blockchainAge is a (string) integer");
        UPDATE_BLOCKCHAIN_AGE(payload);
        t.equal(payload.blockchainAge, flux.store("network").getState().blockchainAge, "payload.blockchainAge == state.blockchainAge");
        flux.register.UPDATE_BLOCKCHAIN_AGE = UPDATE_BLOCKCHAIN_AGE;
        flux.augur.filters.ignore(true, t.end);
    };
    flux.actions.network.updateNetwork(true);
});
