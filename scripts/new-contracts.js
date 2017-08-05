#!/usr/bin/env node

"use strict";

var fs = require("fs");
var join = require("path").join;
var async = require("async");
var Augur = require("../src");
var password = fs.readFileSync(join(process.env.HOME, ".ethereum", ".password")).toString();

var augur = new Augur();
augur.connect({
  http: "http://127.0.0.1:8545",
  ipc: process.env.GETH_IPC,
  ws: "ws://127.0.0.1:8546"
}, function () {
  augur.rpc.personal.listAccounts([], function (accounts) {
    if (!accounts || accounts.constructor !== Array || !accounts.length) {
      return console.error("listAccounts error:", accounts);
    }
    async.eachSeries(accounts, function (account, nextAccount) {
      augur.rpc.personal.unlockAccount([account, password], function (unlocked) {
        if (unlocked && unlocked.error) return nextAccount();
        augur.api.Faucets.fundNewAccount({
          branch: augur.constants.DEFAULT_BRANCH_ID,
          tx: { from: account },
          onSent: function (res) {
            console.log("fundNewAccount", account, "sent:", res);
          },
          onSuccess: function (res) {
            console.log("fundNewAccount", account, "success:", res);
            nextAccount();
          },
          onFailed: function (err) {
            console.error("fundNewAccount", account, "failed:", err);
            nextAccount();
          }
        });
      });
    }, process.exit);
  });
});
