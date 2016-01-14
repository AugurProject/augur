/**
 * augur unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var test = require("tape");
var abi = require("augur-abi");
var augur = require("augur.js");
var BigNumber = require("bignumber.js");
var constants = require("../app/libs/constants");
var flux = require("./mock");

augur.connect(process.env.AUGUR_HOST);

var account = augur.from;
var sink = "0x639b41c4d3d399894f2a57894278e1653e7cd24c";
var branch = augur.branches.dev;
var amount = "1";

test("AssetActions.updateAssets", function (t) {
    var UPDATE_PERCENT_LOADED_SUCCESS = flux.register.UPDATE_PERCENT_LOADED_SUCCESS;
    flux.register.UPDATE_PERCENT_LOADED_SUCCESS = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.percentLoaded, 100, "payload.percentLoaded == 100");
        augur.getRepBalance(branch, account, function (repBalance) {
            // console.log("initial rep balance:", repBalance);
            t.true(repBalance, "reputation balance is not null/undefined");
            t.equal(repBalance.constructor, String, "reputation balance is a string");
            var UPDATE_ASSETS = flux.register.UPDATE_ASSETS;
            flux.register.UPDATE_ASSETS = function (payload) {
                t.equal(payload.constructor, Object, "payload is an object");
                t.true(payload.cash || payload.reputation || payload.ether, "payload fields are not all null/undefined");
                if (payload.reputation) {
                    t.equal(payload.reputation.constructor, BigNumber, "payload.reputation is a BigNumber");
                    t.true(payload.reputation.eq(abi.bignum(repBalance)), "payload.reputation == reputation balance");
                    augur.sendReputation({
                        branchId: branch,
                        to: sink,
                        value: amount,
                        onSent: function (res) {
                            // console.log("sendReputation sent:", res);
                            t.true(res.txHash.constructor, String, "txHash is a string");
                            t.equal(res.callReturn, amount, "callReturn == " + amount);
                        },
                        onSuccess: function (res) {
                            // console.log("sendReputation success:", res);
                            t.true(res.txHash.constructor, String, "txHash is a string");
                            t.equal(res.callReturn, amount, "callReturn == " + amount);
                            augur.getRepBalance(branch, account, function (finalRepBalance) {
                                // console.log("final rep balance:", finalRepBalance);
                                t.true(finalRepBalance, "final reputation balance is not null/undefined");
                                t.equal(repBalance.constructor, String, "final reputation balance is a string");
                                t.true(abi.bignum(repBalance).sub(finalRepBalance).eq(abi.bignum(amount)), "initial - final reputation balance == " + amount);
                                flux.register.UPDATE_ASSETS = function (payload) {
                                    t.equal(payload.constructor, Object, "payload is an object");
                                    t.true(payload.cash || payload.reputation || payload.ether, "payload fields are not all null/undefined");
                                    if (payload.reputation) {
                                        t.equal(payload.reputation.constructor, BigNumber, "payload.reputation is a BigNumber");
                                        t.true(payload.reputation.eq(abi.bignum(finalRepBalance)), "payload.reputation == final reputation balance");
                                        flux.register.UPDATE_PERCENT_LOADED_SUCCESS = UPDATE_PERCENT_LOADED_SUCCESS;
                                        flux.register.UPDATE_ASSETS = UPDATE_ASSETS;
                                        augur.filters.ignore(true, t.end);
                                    }
                                };
                                flux.actions.asset.updateAssets();
                            });
                        },
                        onFailed: function (err) {
                            // console.error("sendReputation failed:", err);
                            throw new Error(augur.utils.pp(err));
                        }
                    });
                }
            };
        });
        flux.actions.asset.updateAssets();
    };
    flux.actions.network.checkNetwork();
});
