/**
 * augur unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var test = require("tape");
var keys = require("keythereum");
var valid = require("validator");
var geth = require("geth");
var join = require("path").join;
var constants = require("../app/libs/constants");
var flux = require("./mock");
var reset = require("./reset");

var handle = "tinybike";
var keystore = require("./account");
var privateKey = keys.recover("tinypassword", keystore);
var address = keys.privateKeyToAddress(privateKey);

flux.actions.config.signOut();
flux.augur.connector.from = flux.augur.coinbase;
flux.augur.connect();

test("ConfigActions.connect", function (t) {
    flux = reset(flux);
    var SET_IS_HOSTED = flux.register.SET_IS_HOSTED;
    var UPDATE_ETHEREUM_STATUS = flux.register.UPDATE_ETHEREUM_STATUS;
    var UPDATE_PERCENT_LOADED_SUCCESS = flux.register.UPDATE_PERCENT_LOADED_SUCCESS;
    var FILTER_SETUP_COMPLETE = flux.register.FILTER_SETUP_COMPLETE;
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
        console.log("STATUS:", payload);
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
        t.equal(Object.keys(storedFilters).length, 4, "config.state has 4 filters");
        var filterId;
        for (var f in storedFilters) {
            if (!storedFilters.hasOwnProperty(f)) continue;
            filterId = storedFilters[f].replace("0x", "");
            t.true(valid.isHexadecimal(filterId), "config.state." + f + " has a valid hex ID");
        }
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
        flux.register.SET_IS_HOSTED = SET_IS_HOSTED;
        flux.register.UPDATE_ETHEREUM_STATUS = UPDATE_ETHEREUM_STATUS;
        flux.register.UPDATE_PERCENT_LOADED_SUCCESS = UPDATE_PERCENT_LOADED_SUCCESS;
        flux.register.FILTER_SETUP_COMPLETE = FILTER_SETUP_COMPLETE;
        flux.register.FILTER_TEARDOWN_COMPLETE = FILTER_TEARDOWN_COMPLETE;
        if (!flux.augur.filters.price_filter.id) return t.end();
        flux.augur.filters.ignore(true, t.end);
    };
    flux.actions.config.connect(true);
});

test("ConfigActions.updateAccount", function (t) {
    t.plan(14);
    var UPDATE_ACCOUNT = flux.register.UPDATE_ACCOUNT;
    flux.register.UPDATE_ACCOUNT = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        t.true(valid.isHexadecimal(payload.currentAccount.replace("0x", "")), "payload.currentAccount is valid hex");
        t.true(Buffer.isBuffer(payload.privateKey), "payload.privateKey is a Buffer");
        t.equal(payload.handle.constructor, String, "payload.handle is a string");
        t.equal(keys.privateKeyToAddress(payload.privateKey), payload.currentAccount, "payload.currentAccount is derived from payload.privateKey");
        UPDATE_ACCOUNT(payload);
        t.pass("dispatch UPDATE_ACCOUNT");
        var storedAccount = flux.store("config").getAccount();
        t.true(valid.isHexadecimal(storedAccount.replace("0x", "")), "stored account is valid hex");
        t.equal(storedAccount, payload.currentAccount, "stored account == payload.currentAccount");
        t.equal(storedAccount, address, "stored account == input currentAccount");
        t.equal(privateKey.toString("hex"), flux.store("config").getPrivateKey().toString("hex"), "input privateKey == ConfigStore.getPrivateKey()");
        t.equal(payload.handle, handle, "payload.handle == input handle");
        t.equal(payload.handle, flux.store("config").getHandle(), "payload.handle == ConfigStore.getHandle()");
        t.deepEqual(flux.store("config").getKeystore(), payload.keystore, "ConfigStore.getKeystore() == payload.keystore");
        t.deepEqual(keystore, payload.keystore, "input keystore == payload.keystore");
        flux.register.UPDATE_ACCOUNT = UPDATE_ACCOUNT;
        if (!flux.augur.filters.price_filter.id) return t.end();
        flux.augur.filters.ignore(true, t.end);
    };
    flux.actions.config.updateAccount({
        handle: handle,
        privateKey: privateKey,
        currentAccount: address,
        keystore: keystore
    });
});

test("ConfigActions.signOut", function (t) {
    t.plan(28);
    var UPDATE_ACCOUNT = flux.register.UPDATE_ACCOUNT;
    flux.register.UPDATE_ACCOUNT = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        t.true(valid.isHexadecimal(payload.currentAccount.replace("0x", "")), "payload.currentAccount is valid hex");
        t.true(Buffer.isBuffer(payload.privateKey), "payload.privateKey is a Buffer");
        t.equal(payload.handle.constructor, String, "payload.handle is a string");
        t.equal(keys.privateKeyToAddress(payload.privateKey), payload.currentAccount, "payload.currentAccount is derived from payload.privateKey");
        UPDATE_ACCOUNT(payload);
        t.pass("dispatch UPDATE_ACCOUNT");
        var storedAccount = flux.store("config").getAccount();
        t.true(valid.isHexadecimal(storedAccount.replace("0x", "")), "stored account is valid hex");
        t.equal(storedAccount, payload.currentAccount, "stored account == payload.currentAccount");
        t.equal(storedAccount, address, "stored account == input currentAccount");
        t.equal(privateKey.toString("hex"), flux.store("config").getPrivateKey().toString("hex"), "input privateKey == ConfigStore.getPrivateKey()");
        t.equal(payload.handle, handle, "payload.handle == input handle");
        t.equal(payload.handle, flux.store("config").getHandle(), "payload.handle == ConfigStore.getHandle()");
        t.deepEqual(flux.store("config").getKeystore(), payload.keystore, "ConfigStore.getKeystore() == payload.keystore");
        t.deepEqual(keystore, payload.keystore, "input keystore == payload.keystore");
        flux.register.UPDATE_ACCOUNT = function (payload) {
            t.equal(payload.constructor, Object, "payload is an object");
            t.equal(payload.currentAccount, null, "payload.currentAccount == null");
            t.equal(payload.privateKey, null, "payload.privateKey == null");
            t.equal(payload.handle, null, "payload.handle == null");
            t.equal(payload.keystore, null, "payload.keystore == null");
            UPDATE_ACCOUNT(payload);
            t.pass("dispatch UPDATE_ACCOUNT");
            t.equal(flux.store("config").getAccount(), null, "stored account == null");
            t.equal(flux.store("config").getPrivateKey(), null, "stored private key == null");
            t.equal(flux.store("config").getHandle(), null, "stored handle == null");
            t.equal(flux.store("config").getKeystore(), null, "stored keystore == null");
            t.equal(flux.augur.web.account.address, undefined, "augur.web.account.address == undefined");
            t.equal(flux.augur.web.account.privateKey, undefined, "augur.web.account.privateKey == undefined");
            t.equal(flux.augur.web.account.handle, undefined, "augur.web.account.handle == undefined");
            t.equal(flux.augur.web.account.keystore, undefined, "augur.web.account.keystore == undefined");
            flux.register.UPDATE_ACCOUNT = UPDATE_ACCOUNT;
            if (!flux.augur.filters.price_filter.id) return t.end();
            flux.augur.filters.ignore(true, t.end);
        };
        flux.actions.config.signOut();
    };
    flux.augur.web.account = {
        handle: handle,
        privateKey: privateKey,
        address: address
    };
    flux.augur.connector.from = address;
    flux.augur.connect();
    flux.augur.rpc.balancer = false;
    flux.actions.config.updateAccount({
        handle: handle,
        privateKey: privateKey,
        currentAccount: address,
        keystore: keystore
    });
});

test("ConfigActions.connectHosted", function (t) {
    t.plan(2);
    flux.actions.config.connectHosted(function (host) {
        t.equal(host, flux.augur.rpc.nodes.hosted[0], "host == augur.rpc.nodes.hosted[0]");
        t.true(flux.augur.rpc.listening(), "augur.rpc.listening() is true");
        if (!flux.augur.filters.price_filter.id) return t.end();
        flux.augur.filters.ignore(true, t.end);
    });
});

test("ConfigActions.setIsHosted", function (t) {
    t.plan(4);
    var isHosted = true;
    var SET_IS_HOSTED = flux.register.SET_IS_HOSTED;
    flux.register.SET_IS_HOSTED = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.isHosted, isHosted, "payload.isHosted == " + isHosted);
        SET_IS_HOSTED(payload);
        t.pass("dispatch SET_IS_HOSTED");
        t.equal(flux.store("config").getState().isHosted, isHosted, "config.state.isHosted == " + isHosted);
        flux.register.SET_IS_HOSTED = SET_IS_HOSTED;
        if (!flux.augur.filters.price_filter.id) return t.end();
        flux.augur.filters.ignore(true, t.end);
    };
    flux.actions.config.setIsHosted(isHosted);
});

test("ConfigActions.setHost", function (t) {
    t.plan(4);
    var host = "https://eth4.augur.net";
    var SET_HOST = flux.register.SET_HOST;
    flux.register.SET_HOST = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.host, host, "payload.host == " + host);
        SET_HOST(payload);
        t.pass("dispatch SET_HOST");
        t.equal(flux.store("config").getState().host, host, "config.state.host == " + host);
        flux.register.SET_HOST = SET_HOST;
        if (!flux.augur.filters.price_filter.id) return t.end();
        flux.augur.filters.ignore(true, t.end);
    };
    flux.actions.config.setHost(host);
});

test("ConfigActions.updatePercentLoaded", function (t) {
    t.plan(4);
    var percentLoaded = 100;
    var UPDATE_PERCENT_LOADED_SUCCESS = flux.register.UPDATE_PERCENT_LOADED_SUCCESS;
    flux.register.UPDATE_PERCENT_LOADED_SUCCESS = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.percentLoaded, percentLoaded, "payload.percentLoaded == " + percentLoaded);
        UPDATE_PERCENT_LOADED_SUCCESS(payload);
        t.pass("dispatch UPDATE_PERCENT_LOADED_SUCCESS");
        t.equal(flux.store("config").getState().percentLoaded, percentLoaded, "config.state.percentLoaded == " + percentLoaded);
        flux.register.UPDATE_PERCENT_LOADED_SUCCESS = UPDATE_PERCENT_LOADED_SUCCESS;
        if (!flux.augur.filters.price_filter.id) return t.end();
        flux.augur.filters.ignore(true, t.end);
    };
    flux.actions.config.updatePercentLoaded(percentLoaded);
});

test("ConfigActions.setupFilters", function (t) {
    t.plan(24);
    var FILTER_SETUP_COMPLETE = flux.register.FILTER_SETUP_COMPLETE;
    var FILTER_TEARDOWN_COMPLETE = flux.register.FILTER_TEARDOWN_COMPLETE;
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
        t.equal(Object.keys(storedFilters).length, 4, "config.state has 4 filters");
        for (var f in storedFilters) {
            if (!storedFilters.hasOwnProperty(f)) continue;
            t.true(valid.isHexadecimal(storedFilters[f].replace("0x", "")), "config.state." + f + " has a valid hex ID");
        }
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
        flux.register.FILTER_TEARDOWN_COMPLETE = FILTER_TEARDOWN_COMPLETE;
        flux.register.FILTER_SETUP_COMPLETE = FILTER_SETUP_COMPLETE;
        flux.register.FILTER_TEARDOWN_COMPLETE = FILTER_TEARDOWN_COMPLETE;
        if (!flux.augur.filters.price_filter.id) return t.end();
        flux.augur.filters.ignore(true, t.end);
    };
    flux.actions.config.setupFilters();
});

test("ConfigActions.teardownFilters", function (t) {
    t.plan(10);
    var FILTER_TEARDOWN_COMPLETE = flux.register.FILTER_TEARDOWN_COMPLETE;
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
        flux.register.FILTER_TEARDOWN_COMPLETE = FILTER_TEARDOWN_COMPLETE;
        if (!flux.augur.filters.price_filter.id) return t.end();
        flux.augur.filters.ignore(true, t.end);
    };
    flux.actions.config.teardownFilters();
});

test("ConfigActions.initializeData", function (t) {
    flux = reset(flux);
    t.plan(51);
    var LOAD_BRANCHES_SUCCESS = flux.register.LOAD_BRANCHES_SUCCESS;
    var SET_CURRENT_BRANCH_SUCCESS = flux.register.SET_CURRENT_BRANCH_SUCCESS;
    var UPDATE_MARKET_SUCCESS = flux.register.UPDATE_MARKET_SUCCESS;
    var LOAD_EVENTS_TO_REPORT_SUCCESS = flux.register.LOAD_EVENTS_TO_REPORT_SUCCESS;
    var UPDATE_EVENT_TO_REPORT = flux.register.UPDATE_EVENT_TO_REPORT;
    var LOAD_PENDING_REPORTS_SUCCESS = flux.register.LOAD_PENDING_REPORTS_SUCCESS;
    var LOAD_APPLICATION_DATA_SUCCESS = flux.register.LOAD_APPLICATION_DATA_SUCCESS;
    var FILTER_SETUP_COMPLETE = flux.register.FILTER_SETUP_COMPLETE;
    var FILTER_TEARDOWN_COMPLETE = flux.register.FILTER_TEARDOWN_COMPLETE;
    flux.register.LOAD_BRANCHES_SUCCESS = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.branches.constructor, Array, "payload.branches is an array");
        t.true(payload.branches.length, "payload.branches.length >= 1");
        t.true(payload.branches.indexOf(flux.augur.branches.dev) > -1, "payload.branches includes " + flux.augur.branches.dev);
        LOAD_BRANCHES_SUCCESS(payload);
        t.pass("dispatch LOAD_BRANCHES_SUCCESS");
        t.deepEqual(payload.branches, flux.store("branch").getState().branches, "payload.branches == stored branches");
    };
    flux.register.SET_CURRENT_BRANCH_SUCCESS = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        t.true(valid.isInt(payload.periodLength.toString()), "payload.periodLength is an integer");
        t.true(payload.periodLength > 0, "payload.periodLength > 0");
        SET_CURRENT_BRANCH_SUCCESS(payload);
        t.pass("dispatch SET_CURRENT_BRANCH_SUCCESS");
        t.deepEqual(payload, flux.store("branch").getCurrentBranch(), "payload == BranchStore.currentBranch");
    };
    flux.register.UPDATE_MARKET_SUCCESS = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        UPDATE_MARKET_SUCCESS(payload);
        t.pass("dispatch UPDATE_MARKET_SUCCESS");
    };
    flux.register.LOAD_EVENTS_TO_REPORT_SUCCESS = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        LOAD_EVENTS_TO_REPORT_SUCCESS(payload);
        t.pass("dispatch LOAD_EVENTS_TO_REPORT_SUCCESS");
    };
    flux.register.UPDATE_EVENT_TO_REPORT = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        UPDATE_EVENT_TO_REPORT(payload);
        t.pass("dispatch UPDATE_EVENT_TO_REPORT");
    };
    flux.register.LOAD_PENDING_REPORTS_SUCCESS = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        LOAD_PENDING_REPORTS_SUCCESS(payload);
        t.pass("dispatch LOAD_PENDING_REPORTS_SUCCESS");
    };
    flux.register.LOAD_APPLICATION_DATA_SUCCESS = function (payload) {
        t.true(flux.augur.filters.price_filter.id === null, "price_filter.id is null");
        t.true(flux.augur.filters.contracts_filter.id === null, "contracts_filter.id is null");
        t.true(flux.augur.filters.block_filter.id === null, "block_filter.id is null");
        t.true(flux.augur.filters.creation_filter.id === null, "creation_filter.id is null");
        t.true(flux.augur.filters.price_filter.heartbeat === null, "price_filter.heartbeat is null");
        t.true(flux.augur.filters.contracts_filter.heartbeat === null, "contracts_filter.heartbeat is null");
        t.true(flux.augur.filters.block_filter.heartbeat === null, "block_filter.heartbeat is null");
        t.true(flux.augur.filters.creation_filter.heartbeat === null, "creation_filter.heartbeat is null");
        LOAD_APPLICATION_DATA_SUCCESS(payload);
        t.pass("dispatch LOAD_APPLICATION_DATA_SUCCESS");
        t.true(flux.store("config").getState().loaded, "config.state.loaded is true");
    };
    flux.register.FILTER_SETUP_COMPLETE = function (payload) {
        t.true(flux.augur.filters.price_filter.id !== null, "price_filter.id is null");
        t.true(flux.augur.filters.contracts_filter.id !== null, "contracts_filter.id is null");
        t.true(flux.augur.filters.block_filter.id !== null, "block_filter.id is null");
        t.true(flux.augur.filters.creation_filter.id !== null, "creation_filter.id is null");
        t.true(flux.augur.filters.price_filter.heartbeat !== null, "price_filter.heartbeat is null");
        t.true(flux.augur.filters.contracts_filter.heartbeat !== null, "contracts_filter.heartbeat is null");
        t.true(flux.augur.filters.block_filter.heartbeat !== null, "block_filter.heartbeat is null");
        t.true(flux.augur.filters.creation_filter.heartbeat !== null, "creation_filter.heartbeat is null");
        FILTER_SETUP_COMPLETE(payload);
        t.pass("dispatch FILTER_SETUP_COMPLETE");
        var storedFilters = flux.store("config").getState().filters;
        t.equal(Object.keys(storedFilters).length, 4, "config.state has 4 filters");
        var filterId;
        for (var f in storedFilters) {
            if (!storedFilters.hasOwnProperty(f)) continue;
            filterId = storedFilters[f].replace("0x", "");
            t.true(valid.isHexadecimal(filterId), "config.state." + f + " has a valid hex ID");
        }
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
        flux.register.LOAD_BRANCHES_SUCCESS = LOAD_BRANCHES_SUCCESS;
        flux.register.SET_CURRENT_BRANCH_SUCCESS = SET_CURRENT_BRANCH_SUCCESS;
        flux.register.UPDATE_MARKET_SUCCESS = UPDATE_MARKET_SUCCESS;
        flux.register.LOAD_EVENTS_TO_REPORT_SUCCESS = LOAD_EVENTS_TO_REPORT_SUCCESS;
        flux.register.UPDATE_EVENT_TO_REPORT = UPDATE_EVENT_TO_REPORT;
        flux.register.LOAD_PENDING_REPORTS_SUCCESS = LOAD_PENDING_REPORTS_SUCCESS;
        flux.register.LOAD_APPLICATION_DATA_SUCCESS = LOAD_APPLICATION_DATA_SUCCESS;
        flux.register.FILTER_SETUP_COMPLETE = FILTER_SETUP_COMPLETE;
        flux.register.FILTER_TEARDOWN_COMPLETE = FILTER_TEARDOWN_COMPLETE;
        if (!flux.augur.filters.price_filter.id) return t.end();
        flux.augur.filters.ignore(true, t.end);
    };
    flux.actions.config.initializeData();
});
