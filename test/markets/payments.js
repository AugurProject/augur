/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var join = require("path").join;
var assert = require("chai").assert;
var abi = require("augur-abi");
var tools = require("../tools");
var constants = require("../../src/constants");
var augurpath = join(__dirname, "..", "..", "src", "index");
var augur = tools.setup(require(augurpath), process.argv.slice(2));

if (process.env.AUGURJS_INTEGRATION_TESTS) {

    var paymentValue = 1;
    var branch = augur.constants.DEFAULT_BRANCH_ID;
    var coinbase = augur.coinbase;
    var testAccounts = tools.get_test_accounts(augur, tools.MAX_TEST_ACCOUNTS);
    var receiver = testAccounts[1];
    if (receiver === coinbase) receiver = testAccounts[0];

    describe("Ether-for-cash", function () {

        var value = 1;
        var weiValue = abi.bignum(value).mul(constants.ETHER).toFixed();
        var initialCash = abi.bignum(augur.getCashBalance(augur.coinbase));

        it("deposit/withdrawEther", function (done) {
            this.timeout(tools.TIMEOUT*2);
            augur.depositEther({
                value: value,
                onSent: function (res) {
                    assert.strictEqual(res.txHash.length, 66);
                    assert.strictEqual(weiValue, res.callReturn);
                },
                onSuccess: function (res) {
                    assert.strictEqual(res.txHash.length, 66);
                    assert.strictEqual(weiValue, res.callReturn);
                    assert.strictEqual(res.from, augur.coinbase);
                    assert.strictEqual(res.to, augur.contracts.cash);
                    var afterCash = abi.bignum(augur.getCashBalance(augur.coinbase));
                    assert.strictEqual(afterCash.sub(initialCash).toNumber(), value);
                    augur.withdrawEther({
                        to: augur.coinbase,
                        value: value,
                        onSent: function (res) {
                            assert.strictEqual(res.txHash.length, 66);
                            assert.strictEqual(res.callReturn, "1");
                        },
                        onSuccess: function (res) {
                            assert.strictEqual(res.txHash.length, 66);
                            assert.strictEqual(res.callReturn, "1");
                            assert.strictEqual(res.from, augur.coinbase);
                            assert.strictEqual(res.to, augur.contracts.cash);
                            var finalCash = abi.bignum(augur.getCashBalance(augur.coinbase));
                            assert.strictEqual(initialCash.toFixed(), finalCash.toFixed());
                            done();
                        },
                        onFailed: done
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
                    // console.log(res);
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
                to: receiver,
                value: paymentValue,
                onSent: function (res) {
                    assert(res.txHash);
                    assert.strictEqual(res.callReturn, paymentValue.toString());
                },
                onSuccess: function (res) {
                    assert(res.txHash);
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
                to: receiver,
                value: paymentValue,
                from: coinbase,
                onSent: function (res) {
                    assert(res.txHash);
                    assert.strictEqual(res.callReturn, paymentValue.toString());
                },
                onSuccess: function (res) {
                    assert(res.txHash);
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
            start_balance = abi.bignum(start_balance);
            augur.sendReputation({
                branchId: branch,
                to: receiver,
                value: paymentValue,
                onSent: function (res) {
                    assert(res.txHash);
                    assert.strictEqual(res.callReturn, paymentValue.toString());
                },
                onSuccess: function (res) {
                    assert(res.txHash);
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

}
