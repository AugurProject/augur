/**
 * augur unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var test = require("tape");
var abi = require("augur-abi");
var BigNumber = require("bignumber.js");
var keys = require("keythereum");
var constants = require("../app/libs/constants");
var flux = require("./mock");
var keystore = require("./account");

var DEBUG = true;
var sink = "0x639b41c4d3d399894f2a57894278e1653e7cd24c";
var amount = "1";
var handle = "tinybike";
var password = "tinypassword";

// manual keythereum "login"
var privateKey = keys.recover(password, keystore);
var address = keys.privateKeyToAddress(privateKey);
flux.augur.web.account = {handle: handle, privateKey: privateKey, address: address};
flux.augur.connector.from = address;
flux.augur.connect();
flux.augur.rpc.balancer = false;

test("AssetActions.updateAssets", function (t) {
    var UPDATE_PERCENT_LOADED_SUCCESS = flux.register.UPDATE_PERCENT_LOADED_SUCCESS;
    flux.register.UPDATE_PERCENT_LOADED_SUCCESS = function (payload) {
        var account = flux.store("config").getAccount();
        var branch = flux.store("branch").getCurrentBranch().id;
        if (DEBUG) console.log("account:", account);
        if (DEBUG) console.log("branch:", branch);
        t.equal(account, address, "ConfigStore account == " + address);
        t.equal(account, flux.augur.web.account.address, "ConfigStore account == augur.web.account.address");
        t.true(abi.bignum(branch).eq(abi.bignum(flux.augur.branches.dev)), "BranchStore currentBranch.id == augur.branches.dev");
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.percentLoaded, 100, "payload.percentLoaded == 100");
        flux.augur.reputationFaucet({
            branch: branch,
            onSent: function (res) {
                if (DEBUG) console.log("reputationFaucet sent:", res);
                t.equal(res.txHash.constructor, String, "txHash is a string");
                t.equal(res.callReturn, "1", "callReturn == '1'");
            },
            onSuccess: function (res) {
                if (DEBUG) console.log("reputationFaucet success:", res);
                t.equal(res.txHash.constructor, String, "txHash is a string");
                t.equal(res.callReturn, "1", "callReturn == '1'");
                flux.augur.getRepBalance(branch, account, function (repBalance) {
                    if (DEBUG) console.log("initial rep balance:", repBalance);
                    t.equal(repBalance, "47", "reputation balance == '47'");
                    var UPDATE_ASSETS = flux.register.UPDATE_ASSETS;
                    flux.register.UPDATE_ASSETS = function (payload) {
                        if (DEBUG) console.log("UPDATE_ASSETS payload:", payload);
                        t.equal(payload.constructor, Object, "payload is an object");
                        t.true(payload.cash || payload.reputation || payload.ether, "payload fields are not all null/undefined");
                        if (payload.reputation) {
                            t.equal(payload.reputation.constructor, BigNumber, "payload.reputation is a BigNumber");
                            t.true(payload.reputation.eq(abi.bignum(repBalance)), "payload.reputation == reputation balance");
                            flux.augur.sendReputation({
                                branchId: branch,
                                to: sink,
                                value: amount,
                                onSent: function (res) {
                                    if (DEBUG) console.log("sendReputation sent:", res);
                                    t.equal(res.txHash.constructor, String, "txHash is a string");
                                    t.equal(res.callReturn, amount, "callReturn == " + amount);
                                },
                                onSuccess: function (res) {
                                    if (DEBUG) console.log("sendReputation success:", res);
                                    t.equal(res.txHash.constructor, String, "txHash is a string");
                                    t.equal(res.callReturn, amount, "callReturn == " + amount);
                                    flux.augur.getRepBalance(branch, account, function (finalRepBalance) {
                                        if (DEBUG) console.log("final rep balance:", finalRepBalance);
                                        t.equal(finalRepBalance.constructor, String, "final reputation balance is a string");
                                        t.true(abi.bignum(repBalance).sub(finalRepBalance).eq(abi.bignum(amount)), "initial - final reputation balance == " + amount);
                                        flux.register.UPDATE_ASSETS = function (payload) {
                                            t.equal(payload.constructor, Object, "payload is an object");
                                            t.true(payload.cash || payload.reputation || payload.ether, "payload fields are not all null/undefined");
                                            if (payload.reputation) {
                                                t.equal(payload.reputation.constructor, BigNumber, "payload.reputation is a BigNumber");
                                                t.true(payload.reputation.eq(abi.bignum(finalRepBalance)), "payload.reputation == final reputation balance");
                                                flux.register.UPDATE_PERCENT_LOADED_SUCCESS = UPDATE_PERCENT_LOADED_SUCCESS;
                                                flux.register.UPDATE_ASSETS = UPDATE_ASSETS;
                                                flux.augur.filters.ignore(true, t.end);
                                            }
                                        };
                                        flux.actions.asset.updateAssets();
                                    });
                                },
                                onFailed: function (err) {
                                    if (DEBUG) console.error("sendReputation failed:", err);
                                    // throw new Error(flux.augur.utils.pp(err));
                                }
                            });
                        }
                    };
                    flux.actions.asset.updateAssets();
                });
            },
            onFailed: function (err) {
                throw new Error(flux.augur.utils.pp(err));
            }
        });
    };
    flux.actions.network.checkNetwork();
});
