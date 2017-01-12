#!/usr/bin/env node

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var tools = require("../test/tools");
var random = require("../test/random");
var augur = require("../src");
augur.options.debug.connect = true;
tools.setup(augur);

var test = function (t) {
  var trade_ids = t.trade_ids || random.hashArray(t.numTrades || random.int(1, 100));
  var tradeHash = augur.makeTradeHash(t.max_value, t.max_amount, trade_ids);
  var contractTradeHash = augur.Trades.makeTradeHash({
    max_value: abi.fix(t.max_value, "hex"),
    max_amount: abi.fix(t.max_amount, "hex"),
    trade_ids: trade_ids
  });
  assert.strictEqual(tradeHash, contractTradeHash);
  console.log("tradeHash:", tradeHash);
  augur.commitTrade({
    hash: tradeHash,
    onSent: function (r) {
      console.log("commit sent:", r);
    },
    onSuccess: function (r) {
      console.log("commit success:", r);
      augur.rpc.fastforward(1, function (block) {
        console.log("got block:", block);
        console.log("calling checkHash:", tradeHash, augur.from);
        var _augur = augur;
        var _abi = abi;
        var checkHash = augur.checkHash(tradeHash, augur.from);
        console.log("checkHash:", checkHash);
        assert.strictEqual(checkHash, "1");
      });
    },
    onFailed: function (err) {
      console.log("commit failed:", err);
    }
  });
};

test({max_value: 1, max_amount: 0, trade_ids: ["0xb5865502c4ce95c1fd5178c975863dd9d412363934a7072fa4bad093190c786a"]});
