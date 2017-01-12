/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var join = require("path").join;
var assert = require("chai").assert;
var abi = require("augur-abi");
var tools = require("../../tools");
var constants = require("../../../src/constants");
var augurpath = join(__dirname, "..", "..", "..", "src", "index");
var DEBUG = false;

function printBalance(account) {
  console.log({
    cash: augur.getCashBalance(account),
    reputation: augur.getRepBalance(branch || augur.constants.DEFAULT_BRANCH_ID, account),
    ether: abi.unfix(augur.rpc.balance(account), "string")
  });
}

var augur = tools.setup(require(augurpath), process.argv.slice(2));

var paymentValue = 1;
var branch = augur.constants.DEFAULT_BRANCH_ID;
var coinbase = augur.coinbase;

var testAccounts = tools.get_test_accounts(augur, tools.MAX_TEST_ACCOUNTS);
var receiver = testAccounts[2];
if (receiver === coinbase) receiver = testAccounts[0];

describe("Ether-for-cash conversion (deposit/withdraw)", function () {

  var value = paymentValue;
  var weiValue = abi.fix(value, "string");
  var sender = augur.from;
  var initialCash = abi.bignum(augur.getCashBalance(sender));
  var account = sender;
  if (DEBUG) printBalance(account);

  it("deposit/withdrawEther", function (done) {
    this.timeout(tools.TIMEOUT*2);
    augur.depositEther({
      value: value,
      onSent: function (res) {
        assert.strictEqual(weiValue, res.callReturn);
      },
      onSuccess: function (res) {
        assert.strictEqual(weiValue, res.callReturn);
        assert.strictEqual(res.from, sender);
        assert.strictEqual(res.to, augur.contracts.Cash);
        var afterCash = abi.bignum(augur.getCashBalance(sender));
        if (DEBUG) console.log(afterCash.sub(initialCash).toNumber(), value);
        if (DEBUG) printBalance(account);
        assert.strictEqual(afterCash.sub(initialCash).toNumber(), value);
        if (DEBUG) printBalance(account);
        augur.rpc.receipt(res.hash, function (depositReceipt) {
          if (DEBUG) console.log(JSON.stringify(depositReceipt, null, 2));
          assert.notProperty(depositReceipt, "error");
          assert.isArray(depositReceipt.logs);
          assert.strictEqual(depositReceipt.logs.length, 1);
          assert.strictEqual(abi.unfix(depositReceipt.logs[0].data, "number"), value);
          augur.withdrawEther({
            to: sender,
            value: value,
            onSent: function (r) {
              assert.strictEqual(r.callReturn, "1");
            },
            onSuccess: function (r) {
              if (DEBUG) printBalance(account);
              assert.strictEqual(r.callReturn, "1");
              assert.strictEqual(r.from, sender);
              assert.strictEqual(r.to, augur.contracts.Cash);
              var finalCash = abi.bignum(augur.getCashBalance(sender));
              assert.strictEqual(initialCash.toFixed(), finalCash.toFixed());
              augur.rpc.receipt(r.hash, function (withdrawReceipt) {
                if (DEBUG) console.log(JSON.stringify(withdrawReceipt, null, 2));
                assert.notProperty(withdrawReceipt, "error");
                assert.isArray(withdrawReceipt.logs);
                assert.strictEqual(withdrawReceipt.logs.length, 1);
                assert.strictEqual(abi.unfix(withdrawReceipt.logs[0].data, "number"), value);
                done();
              });
            },
            onFailed: done
          });
        });
      },
      onFailed: done
    });
  });
});

describe("Payments", function () {

  it("sendEther", function (done) {
    this.timeout(tools.TIMEOUT);
    var augur = tools.setup(require(augurpath), process.argv.slice(2));
    var start_balance = abi.bignum(augur.rpc.balance(receiver));
    start_balance = start_balance.dividedBy(constants.ETHER);
    augur.rpc.sendEther({
      to: receiver,
      value: paymentValue,
      from: augur.coinbase,
      onSent: function (res) {
        if (DEBUG) console.log(res);
      },
      onSuccess: function (res) {
        var final_balance = augur.rpc.balance(receiver);
        final_balance = abi.bignum(final_balance).dividedBy(constants.ETHER);
        assert.strictEqual(final_balance.minus(start_balance).toNumber(), paymentValue);
        done();
      },
      onFailed: done
    });
  });

  it("sendCash", function (done) {
    this.timeout(tools.TIMEOUT);
    var augur = tools.setup(require(augurpath), process.argv.slice(2));
    var start_balance = abi.bignum(augur.getCashBalance(coinbase));
    augur.sendCash({
      recver: receiver,
      value: paymentValue,
      onSent: function (res) {
        assert.strictEqual(res.callReturn, paymentValue.toString());
      },
      onSuccess: function (res) {
        assert.strictEqual(res.callReturn, paymentValue.toString());
        var final_balance = abi.bignum(augur.getCashBalance(coinbase));
        assert.strictEqual(start_balance.minus(final_balance).toNumber(), paymentValue);
        done();
      },
      onFailed: done
    });
  });

  it("sendCashFrom", function (done) {
    this.timeout(tools.TIMEOUT);
    var augur = tools.setup(require(augurpath), process.argv.slice(2));
    var start_balance = abi.bignum(augur.getCashBalance(coinbase));
    augur.sendCashFrom({
      recver: receiver,
      value: paymentValue,
      from: coinbase,
      onSent: function (res) {
        assert.strictEqual(res.callReturn, paymentValue.toString());
      },
      onSuccess: function (res) {
        assert.strictEqual(res.callReturn, paymentValue.toString());
        var final_balance = abi.bignum(augur.getCashBalance(coinbase));
        assert.strictEqual(start_balance.sub(final_balance).toNumber(), paymentValue);
        done();
      },
      onFailed: done
    });
  });

  it("sendReputation", function (done) {
    this.timeout(tools.TIMEOUT);
    var augur = tools.setup(require(augurpath), process.argv.slice(2));
    var start_balance = augur.getRepBalance(branch, coinbase);
    if (DEBUG) console.log("Start balance:", start_balance);
    start_balance = abi.bignum(start_balance);
    augur.sendReputation({
      branch: branch,
      recver: receiver,
      value: paymentValue,
      onSent: function (res) {
        if (DEBUG) console.log(res);
        assert.strictEqual(res.callReturn, paymentValue.toString());
      },
      onSuccess: function (res) {
        if (DEBUG) console.log(res);
        assert.strictEqual(res.callReturn, paymentValue.toString());
        var final_balance = augur.getRepBalance(branch, coinbase);
        final_balance = abi.bignum(final_balance);
        assert.strictEqual(start_balance.sub(final_balance).toNumber(), paymentValue);
        done();
      },
      onFailed: done
    });
  });

});
