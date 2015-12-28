/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var utils = require("../../src/utilities");
var constants = require("../../src/constants");
var augur = utils.setup(require("../../src"), process.argv.slice(2));
var abi = require("augur-abi");

if (!process.env.CONTINUOUS_INTEGRATION) {

    var payment_value = 1;
    var branch = augur.branches.dev;
    var coinbase = augur.coinbase;
    var receiver = utils.get_test_accounts(augur, constants.MAX_TEST_ACCOUNTS)[1];

    describe("Ether-for-cash", function () {

        var value = 1;
        var weiValue = abi.bignum(value).mul(constants.ETHER).toFixed();
        var initialCash = abi.bignum(augur.getCashBalance(augur.coinbase));
        // console.log("initial:", initialCash.toFixed());

        it("deposit/withdrawEther", function (done) {
            this.timeout(constants.TIMEOUT*2);
            augur.depositEther({
                value: value,
                onSent: function (res) {
                    // console.log("sent:", res);
                    assert.strictEqual(res.txHash.length, 66);
                    assert.strictEqual(weiValue, res.callReturn);
                },
                onSuccess: function (res) {
                    // console.log("success:", res);
                    assert.strictEqual(res.txHash.length, 66);
                    assert.strictEqual(weiValue, res.callReturn);
                    assert.strictEqual(res.from, augur.coinbase);
                    assert.strictEqual(res.to, augur.contracts.cash);
                    var afterCash = abi.bignum(augur.getCashBalance(augur.coinbase));
                    // console.log("after:", afterCash.toFixed());
                    assert.strictEqual(afterCash.sub(initialCash).toNumber(), value);
                    augur.withdrawEther({
                        to: augur.coinbase,
                        value: value,
                        onSent: function (res) {
                            // console.log("withdraw sent:", res);
                            assert.strictEqual(res.txHash.length, 66);
                            assert.strictEqual(res.callReturn, "1");
                        },
                        onSuccess: function (res) {
                            // console.log("withdraw success:", res);
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
            this.timeout(constants.TIMEOUT);
            var augur = utils.setup(require("../../src"), process.argv.slice(2));
            var start_balance = abi.bignum(augur.rpc.balance(receiver));
            start_balance = start_balance.dividedBy(constants.ETHER);
            augur.rpc.sendEther({
                to: receiver,
                value: payment_value,
                from: augur.coinbase,
                onSent: function (res) {
                    // console.log(res);
                },
                onSuccess: function (res) {
                    var final_balance = augur.rpc.balance(receiver);
                    final_balance = abi.bignum(final_balance).dividedBy(constants.ETHER);
                    assert.strictEqual(final_balance.sub(start_balance).toNumber(), payment_value);
                    done();
                },
                onFailed: done
            });
        });

        it("sendCash", function (done) {
            this.timeout(constants.TIMEOUT);
            var augur = utils.setup(require("../../src"), process.argv.slice(2));
            var start_balance = abi.bignum(augur.getCashBalance(coinbase));
            augur.sendCash({
                to: receiver,
                value: payment_value,
                onSent: function (res) {
                    // console.log(res);
                },
                onSuccess: function (res) {
                    var final_balance = abi.bignum(augur.getCashBalance(coinbase));
                    assert.strictEqual(start_balance.sub(final_balance).toNumber(), payment_value);
                    done();
                },
                onFailed: done
            });
        });

        it("sendCashFrom", function (done) {
            this.timeout(constants.TIMEOUT);
            var augur = utils.setup(require("../../src"), process.argv.slice(2));
            var start_balance = abi.bignum(augur.getCashBalance(coinbase));
            augur.sendCashFrom({
                to: receiver,
                value: payment_value,
                from: coinbase,
                onSent: function (res) {
                    // console.log(res);
                },
                onSuccess: function (res) {
                    var final_balance = abi.bignum(augur.getCashBalance(coinbase));
                    assert.strictEqual(start_balance.sub(final_balance).toNumber(), payment_value);
                    done();
                },
                onFailed: done
            });
        });

        it("sendReputation", function (done) {
            this.timeout(constants.TIMEOUT);
            var augur = utils.setup(require("../../src"), process.argv.slice(2));
            var start_balance = augur.getRepBalance(branch, coinbase);
            start_balance = abi.bignum(start_balance);
            augur.tx.sendReputation.returns = "number";
            augur.sendReputation({
                branchId: branch,
                to: receiver,
                value: payment_value,
                onSent: function (res) {
                    // console.log(res);
                },
                onSuccess: function (res) {
                    var final_balance = augur.getRepBalance(branch, coinbase);
                    final_balance = abi.bignum(final_balance);
                    assert.strictEqual(start_balance.sub(final_balance).toNumber(), payment_value);
                    done();
                },
                onFailed: done
            });
        });

    });

}
