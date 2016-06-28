#!/usr/bin/env node

"use strict";

var fs = require("fs");
var join = require("path").join;
var async = require("async");
var augur = require("../src");
var password = fs.readFileSync(join(process.env.HOME, ".ethereum", ".password")).toString();

augur.connect("http://127.0.0.1:8545", process.env.GETH_IPC, function (connected) {
    if (!connected) return console.error("connect failed:", connected);
    augur.initDefaultBranch(function (res) {
        console.log("initDefaultBranch sent:", res);
    }, function (res) {
        console.log("initDefaultBranch success:", res);
        augur.rpc.personal("listAccounts", [], function (accounts) {
            if (!accounts || accounts.constructor !== Array || !accounts.length) {
                return console.error("listAccounts error:", accounts);
            }
            async.eachSeries(accounts, function (account, nextAccount) {
                augur.useAccount(account);
                augur.rpc.personal("unlockAccount", [account, password], function (unlocked) {
                    if (!unlocked) return nextAccount("couldn't unlock " + account);
                    augur.fundNewAccount(augur.constants.DEFAULT_BRANCH_ID, function (res) {
                        console.log("fundNewAccount", account, "sent:", res);
                    }, function (res) {
                        console.log("fundNewAccount", account, "success:", res);
                        nextAccount();
                    }, nextAccount);
                });
            }, function (err) {
                if (err) console.error("fundNewAccount failed:", err);
            });
        });
    }, function (err) {
        console.error("initDefaultBranch failed:", err);
    });
});
