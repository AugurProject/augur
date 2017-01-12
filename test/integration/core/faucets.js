"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var tools = require("../../tools");

describe("Faucets", function () {

  var augur = tools.setup(require("../../../src"), process.argv.slice(2));

  if (augur.Cash.balance(augur.from) === "0") {
    it("Faucets.cashFaucet", function (done) {
      this.timeout(tools.TIMEOUT);
      augur.cashFaucet({
        onSent: function (r) {
          assert(abi.bignum(r.txHash).toNumber());
        },
        onSuccess: function (r) {
          assert.notStrictEqual(abi.bignum(r.blockHash).toNumber(), 0);
          assert.isAbove(abi.number(r.blockNumber), 0);
          done();
        },
        onFailed: done
      });
    });
  }

  it("Faucets.reputationFaucet", function (done) {
    this.timeout(tools.TIMEOUT);
    augur.reputationFaucet({
      branch: augur.constants.DEFAULT_BRANCH_ID,
      onSent: function (r) {
        assert.strictEqual(r.callReturn, "1");
        assert(abi.bignum(r.txHash).toNumber());
      },
      onSuccess: function (r) {
        assert.strictEqual(r.callReturn, "1");
        assert.notStrictEqual(abi.bignum(r.blockHash).toNumber(), 0);
        assert.isAbove(abi.number(r.blockNumber), 0);
        var rep_balance = augur.getRepBalance(augur.constants.DEFAULT_BRANCH_ID, augur.coinbase);
        assert.strictEqual(rep_balance, "47");
        done();
      },
      onFailed: done
    });
  });
});
