/**
 * augur unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var test = require("tape");
var validator = require("validator");
var utils = require("../app/libs/utilities");
var flux = require("./mock");
var reset = require("./reset");

test("NetworkActions.checkNetwork", function (t) {
    flux = reset(flux);
    var complete = false;
    var UPDATE_ETHEREUM_STATUS = flux.register.UPDATE_ETHEREUM_STATUS;
    var UPDATE_PERCENT_LOADED_SUCCESS = flux.register.UPDATE_PERCENT_LOADED_SUCCESS;
    flux.register.UPDATE_ETHEREUM_STATUS = function (payload) {
        UPDATE_ETHEREUM_STATUS(payload);
        t.pass("dispatch UPDATE_ETHEREUM_STATUS");
    };
    flux.register.UPDATE_PERCENT_LOADED_SUCCESS = function (payload) {
        t.true(payload.percentLoaded > 0, "payload.percentLoaded > 0");
        t.true(payload.percentLoaded <= 100, "payload.percentLoaded <= 100");
        if (!complete) {
            complete = true;
            flux.register.UPDATE_ETHEREUM_STATUS = UPDATE_ETHEREUM_STATUS;
            flux.register.UPDATE_PERCENT_LOADED_SUCCESS = UPDATE_PERCENT_LOADED_SUCCESS;
            if (!flux.augur.filters.price_filter.id) return t.end();
            flux.augur.filters.ignore(true, t.end);
        }
    };
    t.equal(flux.store("network").getState().ethereumStatus, null, "network state.ethereumStatus is null");
    flux.actions.network.checkNetwork();
});

test("NetworkActions.initializeNetwork", function (t) {
    flux = reset(flux);
    var complete = false;
    var UPDATE_ETHEREUM_STATUS = flux.register.UPDATE_ETHEREUM_STATUS;
    var UPDATE_BLOCKCHAIN_AGE = flux.register.UPDATE_BLOCKCHAIN_AGE;
    flux.register.UPDATE_ETHEREUM_STATUS = function (payload) {
        var expectedStatus = ["ETHEREUM_STATUS_CONNECTED", "ETHEREUM_STATUS_NO_ACCOUNT"];
        t.true(validator.isIn(payload.ethereumStatus, expectedStatus), "payload.ethereumStatus in " + expectedStatus.join(", "));
        UPDATE_ETHEREUM_STATUS(payload);
    };
    flux.register.UPDATE_BLOCKCHAIN_AGE = function (payload) {
        t.true(validator.isInt(payload.blockchainAge.toString()), "payload.blockchainAge is a (string) integer");
        UPDATE_BLOCKCHAIN_AGE(payload);
        t.equal(payload.blockchainAge, flux.store("network").getState().blockchainAge, "payload.blockchainAge == state.blockchainAge");
        if (!complete) {
            complete = true;
            flux.register.UPDATE_ETHEREUM_STATUS = UPDATE_ETHEREUM_STATUS;
            flux.register.UPDATE_BLOCKCHAIN_AGE = UPDATE_BLOCKCHAIN_AGE;
            if (!flux.augur.filters.price_filter.id) return t.end();
            flux.augur.filters.ignore(true, t.end);
        }
    };
    flux.actions.network.initializeNetwork();
});

test("NetworkActions.updateNetwork", function (t) {
    t.plan(2);
    var complete = false;
    var UPDATE_BLOCKCHAIN_AGE = flux.register.UPDATE_BLOCKCHAIN_AGE;
    flux.register.UPDATE_BLOCKCHAIN_AGE = function (payload) {
        t.true(validator.isInt(payload.blockchainAge.toString()), "payload.blockchainAge is a (string) integer");
        UPDATE_BLOCKCHAIN_AGE(payload);
        t.equal(payload.blockchainAge, flux.store("network").getState().blockchainAge, "payload.blockchainAge == state.blockchainAge");
        flux.register.UPDATE_BLOCKCHAIN_AGE = UPDATE_BLOCKCHAIN_AGE;
        if (!complete) {
            complete = true;
            flux.register.UPDATE_BLOCKCHAIN_AGE = UPDATE_BLOCKCHAIN_AGE;
            if (!flux.augur.filters.price_filter.id) return t.end();
            flux.augur.filters.ignore(true, t.end);
        }
    };
    flux.actions.network.updateNetwork(true);
});
