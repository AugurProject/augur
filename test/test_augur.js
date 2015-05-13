#!/usr/bin/env node
/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var assert = require("assert");
var Augur = require("../augur");
var constants = require("./constants");

var log = console.log;

function array_equal(a, b) {
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
function gteq0(n) { return (parseFloat(n) >= 0); }
function is_array(r) {
    assert(r.constructor === Array);
    assert(r.length > 0);
}
function is_object(r) {
    assert(r.constructor === Object);
}
function is_empty(o) {
    for (var i in o) {
        if (o.hasOwnProperty(i)) return false;
    }
    return true;
}
function on_root_branch(r) {
    assert(parseInt(r.branch) === 1010101);
}
function is_not_zero(r) {
    assert(r.id !== "0" && r.id !== "0x" && r.id !== "0x0" && parseInt(r) !== 0);
}

describe("Augur API", function () {

    var ex_integer = 12345678901;
    var ex_decimal = 0.123456789;
    var ex_integer_hex = "0x2dfdc1c35";
    var ex_integer_string = "12345678901";
    var ex_decimal_string = "0.123456789";

    describe("bignum", function () {
        it("should be the same if called with a float or a string", function () {
            assert(Augur.bignum(ex_decimal).eq(Augur.bignum(ex_decimal_string)));
        });
    });
    describe("fix", function () {
        it("should be equal to round(n*2^64)", function () {
            assert(Augur.fix(ex_decimal, "BigNumber").eq((new BigNumber(ex_decimal)).mul(Augur.ONE).round()));
        });
        it("should return a base 10 string '2277375790844960561'", function () {
            assert(Augur.fix(ex_decimal, "string") === "2277375790844960561");
        });
        it("should return a base 16 string '0x1f9add3739635f31'", function () {
            assert(Augur.fix(ex_decimal_string, "hex") === "0x1f9add3739635f31");
        });
    });
    describe("unfix", function () {
        it("fixed-point -> hex", function () {
            assert.equal(Augur.unfix(Augur.fix(ex_integer_hex, "BigNumber"), "hex"), ex_integer_hex);
        });
        it("fixed-point -> string", function () {
            assert.equal(Augur.unfix(Augur.fix(ex_integer_string, "BigNumber"), "string"), ex_integer_string);
        });
        it("fixed-point -> number", function () {
            assert.equal(Augur.unfix(Augur.fix(ex_integer_string, "BigNumber"), "number"), ex_integer);
        });
    });

    var amount = "1";
    var branch_id = "1010101";
    var branch_number = "1";
    var participant_id = constants.accounts.jack;
    var participant_number = "1";
    var outcome = Augur.NO.toString();
    var event_id = "0xad44348923ceef739870714956af736593a355be3ba2de72b75bb0c4aafae9d6";
    var market_id = "-0x18cd5f68179ef03de19ed685ee1b469026de45d118b54e0d6551239a63bdaa6b";
    var market_id2 = "-0x22ab7b98b0dc9567855f703353818668131835223b68455058ea34a0961a57ac";
    var event_description = "[augur.js] " + Math.random().toString(36).substring(4);
    var market_description = "[augur.js] " + Math.random().toString(36).substring(4);
    var reporter_index = "0";
    var reporter_address = constants.accounts.jack;
    var ballot = [Augur.YES, Augur.YES, Augur.NO, Augur.YES];
    var salt = "1337";
    var receiving_account = constants.accounts.joey;
    var vote_period = 1;

    // cash.se
    describe("cash.se", function () {
        // Augur.getCashBalance(Augur.coinbase, function (r) {
        //     describe("getCashBalance(" + Augur.coinbase + ") -> " + r, function () {
        //         it("is not zero", function () {
        //             is_not_zero(r);
        //         });
        //         Augur.getCashBalance(receiving_account, function (r) {
        //             describe("getCashBalance(" + receiving_account + ") -> " + r, function () {
        //                 Augur.tx.sendCash.send = false;
        //                 Augur.tx.sendCash.returns = "unfix";
        //                 Augur.sendCash(receiving_account, amount, function (r) {
        //                     describe("sendCash(" + receiving_account + ", " + amount + ") [call] -> " + r, function () {
        //                         it("is not zero", function () {
        //                             is_not_zero(r);
        //                         });
        //                         it("is equal to the input amount", function () {
        //                             assert(r === amount);
        //                         });
        //                         Augur.tx.sendCash.send = true;
        //                         Augur.tx.sendCash.returns = undefined;
        //                         Augur.sendCash(receiving_account, amount, function (r) {
        //                             log("sendCash(" + receiving_account + ", " + amount + ") [sendTx] -> " + r);
        //                             is_not_zero(r);
        //                             // TODO check that balances actually changed
        //                         });
        //                     });
        //                 });
        //             });
        //         });
        //     });
        // });
        describe("cashFaucet() [call] -> '1'", function () {
            Augur.tx.cashFaucet.send = false;
            Augur.tx.cashFaucet.returns = "number";
            var res = Augur.cashFaucet();
            it("sync", function () {
                assert.equal(res, "1");
            });
            it("async", function (done) {
                Augur.cashFaucet(function (r) {
                    assert.equal(r, "1");
                    done();
                });
            });
        });
        describe("cashFaucet() [sendTx] != 0", function () {
            // it("sync", function () {
            //     Augur.tx.cashFaucet.send = true;
            //     Augur.tx.cashFaucet.returns = undefined;
            //     var res = Augur.cashFaucet();
            //     is_not_zero(res);
            // });
            it("async", function (done) {
                Augur.tx.cashFaucet.send = true;
                Augur.tx.cashFaucet.returns = undefined;
                Augur.cashFaucet(function (txhash) {
                    assert(txhash.constructor === String);
                    assert(txhash.length > 2);
                    assert(txhash.length === 66);
                    assert.ok(parseInt(txhash));
                    assert.ok(Augur.bignum(txhash));
                });
                done();
            });
        });
    });

    // info.se
    describe("info.se", function () {
        describe("getCreator(" + event_id + ") [event] -> 0x63524e3fe4791aefce1e932bbfb3fdf375bfad89", function () {
            it("sync", function () {
                var res = Augur.getCreator(event_id);
                assert.equal(res, "0x63524e3fe4791aefce1e932bbfb3fdf375bfad89");
            });
            it("async", function (done) {
                Augur.getCreator(event_id, function (r) {
                    assert.equal(r, "0x63524e3fe4791aefce1e932bbfb3fdf375bfad89");
                    done();
                });
            });
        });
        describe("getCreator(" + market_id + ") [market] -> 0x63524e3fe4791aefce1e932bbfb3fdf375bfad89", function () {
            it("sync", function () {
                var res = Augur.getCreator(market_id);
                assert.equal(res, "0x63524e3fe4791aefce1e932bbfb3fdf375bfad89");
            });
            it("async", function (done) {
                Augur.getCreator(market_id, function (r) {
                    assert.equal(r, "0x63524e3fe4791aefce1e932bbfb3fdf375bfad89");
                    done();
                });
            });
        });
        describe("getCreationFee(" + event_id + ") [event]", function () {
            it("sync", function () {
                var res = Augur.getCreationFee(event_id);
                assert.equal(res, "0.00000000000000000244");
            });
            it("async", function (done) {
                Augur.getCreationFee(event_id, function (r) {
                    assert.equal(r, "0.00000000000000000244");
                    done();
                });
            });
        });
        describe("getCreationFee(" + market_id + ") [market]", function () {
            it("sync", function () {
                var res = Augur.getCreationFee(market_id);
                assert.equal(res, "7500");
            });
            it("async", function (done) {
                Augur.getCreationFee(market_id, function (r) {
                    assert.equal(r, "7500");
                    done();
                });
            });
        });
        describe("getDescription(" + event_id + ")", function () {
            it("sync", function () {
                var res = Augur.getDescription(event_id);
                assert.equal(res, "Will Hillary Rodham Clinton win the 2016 presidential race?");
            });
            it("async", function (done) {
                Augur.getDescription(event_id, function (r) {
                    assert.equal(r, "Will Hillary Rodham Clinton win the 2016 presidential race?");
                    done();
                });
            });
        });
    });

    // branches.se
    describe("branches.se", function () {
        describe("getBranches: array length >= 3", function () {
            var test = function (r) {
                is_array(r);
                assert(r.length >= 3);
            };
            it("sync", function () {
                test(Augur.getBranches());
            });
            it("async", function (done) {
                Augur.getBranches(function (r) {
                    test(r); done();
                });
            });
        });
        describe("getMarkets(" + branch_id + "): array length > 1, first two elements equal to 232", function () {
            var test = function (r) {
                is_array(r);
                assert(r.length > 1);
                assert.equal(r[0], "0x00000000000000000000000000000000000000000000000000000000000000e8");
                assert.equal(r[1], "0x00000000000000000000000000000000000000000000000000000000000000e8");
            };
            it("sync", function () {
                test(Augur.getMarkets(branch_id));
            });
            it("async", function (done) {
                Augur.getMarkets(branch_id, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getPeriodLength(" + branch_id + ") == '20'", function () {
            var test = function (r) {
                assert.equal(r, "20");
            };
            it("sync", function () {
                test(Augur.getPeriodLength(branch_id));
            });
            it("async", function (done) {
                Augur.getPeriodLength(branch_id, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getVotePeriod(" + branch_id + ") >= 2", function () {
            var test = function (r) {
                assert(parseInt(r) >= 2);
            };
            it("sync", function () {
                test(Augur.getVotePeriod(branch_id));
            });
            it("async", function (done) {
                Augur.getVotePeriod(branch_id, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getStep(" + branch_id + ") <= 9", function () {
            var test = function (r) {
                assert(parseInt(r) >= 0 && parseInt(r) <= 9);
            };
            it("sync", function () {
                test(Augur.getStep(branch_id));
            });
            it("async", function (done) {
                Augur.getStep(branch_id, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getNumMarkets(" + branch_id + ") >= 120", function () {
            var test = function (r) {
                assert(parseInt(r) >= 120);
            };
            it("sync", function () {
                test(Augur.getNumMarkets(branch_id));
            });
            it("async", function (done) {
                Augur.getNumMarkets(branch_id, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getMinTradingFee(" + branch_id + ")", function () {
            var test = function (r) {
                assert(parseFloat(r) >= 0.0);
                assert(parseFloat(r) <= 1.0);
            };
            it("sync", function () {
                test(Augur.getMinTradingFee(branch_id));
            });
            it("async", function (done) {
                Augur.getMinTradingFee(branch_id, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getNumBranches()", function () {
            var test = function (r) {
                assert(parseInt(r) >= 3);
            };
            it("sync", function () {
                test(Augur.getNumBranches());
            });
            it("async", function (done) {
                Augur.getNumBranches(function (r) {
                    test(r); done();
                });
            });
        });
        describe("getBranch(" + branch_number + ")", function () {
            var test = function (r) {
                assert.equal(r, "0x7f5026f174d59f6f01ff3735773b5e3adef0b9c98f8a8e84e0000f034cfbf35a");
            };
            it("sync", function () {
                test(Augur.getBranch(branch_number));
            });
            it("async", function (done) {
                Augur.getBranch(branch_number, function (r) {
                    test(r); done();
                });
            });
        });
    });

    // events.se
    describe("events.se", function () {
        describe("getEventInfo(" + event_id + ")", function () {
            var test = function (res) {
                on_root_branch(res);
                assert.equal(res.expirationDate, "4629146");
                assert.equal(res.description, "Will Hillary Rodham Clinton win the 2016 presidential race?");
            };
            it("sync", function () {
                test(Augur.getEventInfo(event_id));
                
            });
            it("async", function (done) {
                Augur.getEventInfo(event_id, function (r) {
                    test(r); done();
                });
            });
        });

        // TODO getEventBranch
        describe("getExpiration(" + event_id + ") == '4629146'", function () {
            var test = function (r) {
                assert.equal(r, "4629146");
            };
            it("sync", function () {
                test(Augur.getExpiration(event_id));
            });
            it("async", function (done) {
                Augur.getExpiration(event_id, function (r) {
                    test(r); done();
                });
            });
        });
        // TODO getOutcome
        describe("getMinValue(" + event_id + ") == '1'", function () {
            var test = function (r) {
                assert.equal(r, "1");
            };
            it("sync", function () {
                test(Augur.getMinValue(event_id));
            });
            it("async", function (done) {
                Augur.getMinValue(event_id, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getMaxValue(" + event_id + ") == '2'", function () {
            var test = function (r) {
                assert.equal(r, "2");
            };
            it("sync", function () {
                test(Augur.getMaxValue(event_id));
            });
            it("async", function (done) {
                Augur.getMaxValue(event_id, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getNumOutcomes(" + event_id + ") == '2'", function () {
            var test = function (r) {
                assert.equal(r, "2");
            };
            it("sync", function () {
                test(Augur.getNumOutcomes(event_id));
            });
            it("async", function (done) {
                Augur.getNumOutcomes(event_id, function (r) {
                    test(r); done();
                });
            });
        });
    });

    // expiringEvents.se
    describe("expiringEvents.se", function () {
        describe("getEvents(" + branch_id + ", " + vote_period + ")", function () {
            var test = function (r) {
                log(r);
            };
            it("sync", function () {
                test(Augur.getEvents(branch_id, vote_period));
            });
            it("async", function (done) {
                Augur.getEvents(branch_id, vote_period, function (r) {
                    test(r); done();
                });
            });
        });
    });

    // markets.se
    describe("markets.se", function () {
        describe("getSimulatedBuy(" + market_id + ", " + outcome + ", " + amount + ")", function () {
            var test = function (r) {
                is_array(r);
                assert.equal(r.length, 2);
                gteq0(r[0]);
                gteq0(r[1]);
            };
            it("sync", function () {
                test(Augur.getSimulatedBuy(market_id, outcome, amount));
            });
            it("async", function (done) {
                Augur.getSimulatedBuy(market_id, outcome, amount, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getSimulatedSell(" + market_id + ", " + outcome + ", " + amount + ")", function () {
            var test = function (r) {
                assert.equal(r.length, 2);
                is_array(r);
                gteq0(r[0]);
                gteq0(r[1]);
            };
            it("sync", function () {
                test(Augur.getSimulatedSell(market_id, outcome, amount));
            });
            it("async", function (done) {
                Augur.getSimulatedSell(market_id, outcome, amount, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getMarketInfo", function () {
            var market_id = "0x47c8189cbfd101665c59a13491ef1a44604c0d590d7483833acc4c536f0b33b0";
            var marketInfo = Augur.getMarketInfo(market_id);
            it("should have 2 outcomes", function () {
                assert.equal("2", marketInfo.numOutcomes);
            });
            it("should have trading period 231457", function () {
                assert.equal("231457", marketInfo.tradingPeriod);
            });
            it("should have description 'Will Hillary Rodham Clinton win the 2016 presidential race?'", function () {
                assert.equal("Will Hillary Rodham Clinton win the 2016 presidential race?", marketInfo.description);
            });
        });
        describe("getMarketInfo(" + market_id + ")", function () {
            var test = function (r) {
                assert.equal(r.description, "Will the Augur software sale total be at least $1M?");
            };
            it("sync", function () {
                test(Augur.getMarketInfo(market_id));
            });
            it("async", function (done) {
                Augur.getMarketInfo(market_id, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getMarketInfo(" + market_id2 + ")", function () {
            var test = function (r) {
                assert.equal(r.description, "Will the Augur alpha be out by Friday, May 15, 2015?");
            };
            it("sync", function () {
                test(Augur.getMarketInfo(market_id2));
            });
            it("async", function (done) {
                Augur.getMarketInfo(market_id2, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getMarketEvents(" + market_id + ")", function () {
            function test(r) {
                assert.equal(r.constructor, Array);
                assert(array_equal(r, ['0xac56b05b587d461380671978fc7a997a5364b378d3f5fd386f74653080386808']));
            }
            it("sync", function () {
                test(Augur.getMarketEvents(market_id));
            });
            it("async", function (done) {
                Augur.getMarketEvents(market_id, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getNumEvents(" + market_id + ") === '1'", function () {
            var test = function (r) {
                assert.equal(r, "1");
            };
            it("sync", function () {
                test(Augur.getNumEvents(market_id));
            });
            it("async", function (done) {
                Augur.getNumEvents(market_id, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getBranchID(" + market_id + ")", function () {
            var test = function (r) {
                assert.equal(r, "0x0f69b5");
            };
            it("sync", function () {
                test(Augur.getBranchID(market_id));
            });
            it("async", function (done) {
                Augur.getBranchID(market_id, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getCurrentParticipantNumber(" + market_id + ") >= 0", function () {
            var test = function (r) {
                gteq0(r);
            };
            it("sync", function () {
                test(Augur.getCurrentParticipantNumber(market_id));
            });
            it("async", function (done) {
                Augur.getCurrentParticipantNumber(market_id, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getMarketNumOutcomes(" + market_id + ") ", function () {
            var test = function (r) {
                assert.equal(r, "2");
            };
            it("sync", function () {
                test(Augur.getMarketNumOutcomes(market_id));
            });
            it("async", function (done) {
                Augur.getMarketNumOutcomes(market_id, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getParticipantSharesPurchased(" + market_id + ", " + participant_number + "," + outcome + ") ", function () {
            var test = function (r) {
                gteq0(r);
            };
            it("sync", function () {
                test(Augur.getParticipantSharesPurchased(market_id, participant_number, outcome));
            });
            it("async", function (done) {
                Augur.getParticipantSharesPurchased(market_id, participant_number, outcome, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getSharesPurchased(" + market_id + ", " + outcome + ") ", function () {
            var test = function (r) {
                gteq0(r);
            };
            it("sync", function () {
                test(Augur.getSharesPurchased(market_id, outcome));
            });
            it("async", function (done) {
                Augur.getSharesPurchased(market_id, outcome, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getWinningOutcomes(" + market_id + ")", function () {
            var test = function (r) {
                is_array(r);
            };
            it("sync", function () {
                test(Augur.getWinningOutcomes(market_id));
            });
            it("async", function (done) {
                Augur.getWinningOutcomes(market_id, function (r) {
                    test(r); done();
                });
            });
        });
        describe("price(" + market_id + ", " + outcome + ") ", function () {
            var test = function (r) {
                assert(parseFloat(r) >= 0.0);
                assert(parseFloat(r) <= 1.0);
            };
            it("sync", function () {
                test(Augur.price(market_id, outcome));
            });
            it("async", function (done) {
                Augur.price(market_id, outcome, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getParticipantNumber(" + market_id + ", " + constants.accounts.jack + ") ", function () {
            var test = function (r) {
                gteq0(r);
            };
            it("sync", function () {
                test(Augur.getParticipantNumber(market_id, constants.accounts.jack));
            });
            it("async", function (done) {
                Augur.getParticipantNumber(market_id, constants.accounts.jack, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getParticipantID(" + market_id + ", " + participant_number + ") ", function () {
            var test = function (r) {
                gteq0(r);
            };
            it("sync", function () {
                test(Augur.getParticipantID(market_id, participant_number));
            });
            it("async", function (done) {
                Augur.getParticipantID(market_id, participant_number, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getAlpha(" + market_id + ") ", function () {
            var test = function (r) {
                assert.equal(parseFloat(r).toFixed(6), "0.007900");
            };
            it("sync", function () {
                test(Augur.getAlpha(market_id));
            });
            it("async", function (done) {
                Augur.getAlpha(market_id, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getCumScale(" + market_id + ") ", function () {
            var test = function (r) {
                assert.equal(r, "0.00000000000000000005");
            };
            it("sync", function () {
                test(Augur.getCumScale(market_id));
            });
            it("async", function (done) {
                Augur.getCumScale(market_id, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getTradingPeriod(" + market_id + ") ", function () {
            var test = function (r) {
                assert.equal(r, "66202");
            };
            it("sync", function () {
                test(Augur.getTradingPeriod(market_id));
            });
            it("async", function (done) {
                Augur.getTradingPeriod(market_id, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getTradingFee(" + market_id + ") ", function () {
            var test = function (r) {
                assert.equal(r, "0.02999999999999999997");
            };
            it("sync", function () {
                test(Augur.getTradingFee(market_id));
            });
            it("async", function (done) {
                Augur.getTradingFee(market_id, function (r) {
                    test(r); done();
                });
            });
        });
    });

    // reporting.se
    describe("reporting.se", function () {
        describe("getRepBalance(" + branch_id + ") ", function () {
            var test = function (r) {
                gteq0(r);
            };
            it("sync", function () {
                test(Augur.getRepBalance(branch_id, Augur.coinbase));
            });
            it("async", function (done) {
                Augur.getRepBalance(branch_id, Augur.coinbase, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getRepByIndex(" + branch_id + ", " + reporter_index + ") ", function () {
            var test = function (r) {
                gteq0(r);
            };
            it("sync", function () {
                test(Augur.getRepByIndex(branch_id, reporter_index));
            });
            it("async", function (done) {
                Augur.getRepByIndex(branch_id, reporter_index, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getReporterID(" + branch_id + ", " + reporter_index + ") ", function () {
            var test = function (r) {
                assert.equal(r, "0x1c11aa45c792e202e9ffdc2f12f99d0d209bef70");
            };
            it("sync", function () {
                test(Augur.getReporterID(branch_id, reporter_index));
            });
            it("async", function (done) {
                Augur.getReporterID(branch_id, reporter_index, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getReputation(" + reporter_address + ")", function () {
            var test = function (r) {
                is_array(r);
                assert(r.length >= 3); // why equal to 5...?
                for (var i = 0, len = r.length; i < len; ++i) {
                    gteq0(r[i]);
                }
            };
            it("sync", function () {
                test(Augur.getReputation(reporter_address));
            });
            it("async", function (done) {
                Augur.getReputation(reporter_address, function (r) {
                    test(r); done();
                });
            });
        });
        describe("getNumberReporters(" + branch_id + ") ", function () {
            var test = function (r) {
                gteq0(r);
                assert(parseInt(r) >= 22);
            };
            it("sync", function () {
                test(Augur.getNumberReporters(branch_id));
            });
            it("async", function (done) {
                Augur.getNumberReporters(branch_id, function (r) {
                    test(r); done();
                });
            });
        });
        describe("repIDToIndex(" + branch_id + ") ", function () {
            var test = function (r) {
                log(r);
            };
            it("sync", function () {
                test(Augur.repIDToIndex(branch_id, "0"));
            });
            it("async", function (done) {
                Augur.repIDToIndex(branch_id, "0", function (r) {
                    test(r); done();
                });
            });
        });
        describe("hashReport([ballot], " + salt + ") ", function () {
            var test = function (r) {
                // TODO double-check this
                assert.equal(r, "0xa5ea8e72fa70be0521a240201dedd1376599a9a935be4977d798522bcfbc29de");
            };
            it("sync", function () {
                test(Augur.hashReport(ballot, salt));
            });
            it("async", function (done) {
                Augur.hashReport(ballot, salt, function (r) {
                    test(r); done();
                });
            });
        });
        Augur.tx.reputationFaucet.send = false;
        Augur.tx.reputationFaucet.returns = "number";
        describe("reputationFaucet(" + branch_id + ") ", function () {
            var test = function (r) {
                assert.equal(r, "1");
            };
            it("sync", function () {
                test(Augur.reputationFaucet());
            });
            it("async", function (done) {
                Augur.reputationFaucet(function (r) {
                    test(r); done();
                });
            });
        });
    });

    // checkQuorum.se
    describe("checkQuorum.se", function () {
        describe("checkQuorum(" + branch_id + ")", function () {
            var test = function (r) {
                assert(parseInt(r) === 0 || parseInt(r) === 1);
            };
            it("sync", function () {
                test(Augur.checkQuorum(branch_id));
            });
            it("async", function (done) {
                Augur.checkQuorum(branch_id, function (r) {
                    test(r); done();
                });
            });
        });
    });

    // buy&sellShares.se
    describe("buy&sellShares.se", function () {
        describe("getNonce(" + market_id + ") ", function () {
            var test = function (r) {
                assert.equal(r, "0");
            };
            it("sync", function () {
                test(Augur.getNonce(market_id));
            });
            it("async", function (done) {
                Augur.getNonce(market_id, function (r) {
                    test(r); done();
                });
            });
        });
        describe("buyShares(" + branch_id + ", " + market_id + ", " + outcome + ", " + amount + ", null)", function () {
            it("async", function (done) {
                this.timeout(30000);
                var amount = (Math.random() * 10).toString();
                Augur.tx.buyShares.send = true;
                Augur.buyShares({
                    branchId: branch_id,
                    marketId: market_id,
                    outcome: outcome,
                    amount: amount,
                    nonce: null,
                    onSent: function (r) {
                        log("sent:");
                        log(r);
                        done();
                    },
                    onSuccess: function (r) {
                        log("success:");
                        log(r);
                        done();
                    },
                    onFailed: function (r) {
                        log("failed:");
                        log(r);
                        done();
                    }
                });
            });
        });
        describe("sellShares(" + branch_id + ", " + market_id + ", " + outcome + ", " + amount + ", null)", function () {
            it("async", function (done) {
                this.timeout(30000);
                var amount = (Math.random() * 10).toString();
                Augur.tx.sellShares.send = true;
                Augur.sellShares({
                    branchId: branch_id,
                    marketId: market_id,
                    outcome: outcome,
                    amount: amount,
                    nonce: null,
                    onSent: function (r) {
                        log("sent:");
                        log(r);
                        done();
                    },
                    onSuccess: function (r) {
                        log("success:");
                        log(r);
                        done();
                    },
                    onFailed: function (r) {
                        log("failed:");
                        log(r);
                        done();
                    }
                });
            });
        });
    });

    // createBranch.se

    // p2pWagers.se

    // sendReputation.se
    // call: returns rep amount sent
    describe("sendReputation.se", function () {
        describe("sendReputation(" + branch_id + ", " + receiving_account + ", " + amount + ") [call] ", function () {
            it("async", function (done) {
                Augur.tx.sendReputation.send = false;
                Augur.tx.sendReputation.returns = "unfix";
                Augur.sendReputation(branch_id, receiving_account, amount, function (r) {
                    is_not_zero(r);
                    assert.equal(r, amount);
                    // sendTx: returns txhash
                    Augur.tx.sendReputation.send = true;
                    Augur.tx.sendReputation.returns = undefined;
                    Augur.sendReputation(branch_id, receiving_account, amount, function (r) {
                        // log("sendReputation(" + branch_id + ", " + receiving_account + ", " + amount + ") [sendTx] -> " + r);
                        is_not_zero(r);
                        var larger_amount = "9000"; // should fail
                        Augur.tx.sendReputation.send = false;
                        Augur.tx.sendReputation.returns = "number";
                        Augur.sendReputation(branch_id, receiving_account, larger_amount, function (r) {
                            // log("sendReputation(" + branch_id + ", " + receiving_account + ", " + larger_amount + ") [call] -> " + r);
                            assert.equal(r, "0");
                            Augur.tx.sendReputation.send = true;
                            Augur.tx.sendReputation.returns = undefined;
                            done();
                        });
                    });
                });
            });
        });
    });

    // transferShares.se

    // makeReports.se

    // createEvent.se
    describe("createEvent.se", function () {
        describe("createEvent: \"" + event_description + "\"", function () {
            it("async", function (done) {
                this.timeout(30000);
                var expDate = "3000000";
                var minValue = "1";
                var maxValue = "2";
                var numOutcomes = "2";
                var eventObj = {
                    branchId: branch_id,
                    description: event_description,
                    expDate: expDate,
                    minValue: minValue,
                    maxValue: maxValue,
                    numOutcomes: numOutcomes,
                    onSent: function (r) {
                        log("sent: " + JSON.stringify(r, null, 2));
                        is_object(r);
                        assert(!is_empty(r));
                        is_not_zero(r.id);
                        is_not_zero(r.txHash);
                        done();
                    },
                    onSuccess: function (r) {
                        log("success: " + JSON.stringify(r, null, 2));
                        is_object(r);
                        assert(!is_empty(r));
                        is_not_zero(r.id);
                        is_not_zero(r.txHash);
                        assert.equal(r.branch, branch_id);
                        assert.equal(r.expirationDate, expDate);
                        assert.equal(r.minValue, minValue);
                        assert.equal(r.maxValue, maxValue);
                        assert.equal(r.numOutcomes, numOutcomes);
                        assert.equal(r.description, event_description);
                        done();
                    },
                    onFailed: function (r) {
                        log("failed: " + JSON.stringify(r, null, 2));
                        is_object(r);
                        assert(!is_empty(r));
                        done();
                    }
                };
                Augur.createEvent(eventObj);
            });
        });
    });

    // createMarket.se
    describe("createMarket.se", function () {
        describe("createMarket: \"" + market_description + "\"", function () {
            it("async", function (done) {
                this.timeout(30000);
                var alpha = "0.0079";
                var initialLiquidity = "100";
                var tradingFee = "0.01";
                var events = ["-0x2ae31f0184fa3e11a1517a11e3fc6319cb7c310cee36b20f8e0263049b1f3a6f"];
                var numOutcomes = "2";
                var marketObj = {
                    branchId: branch_id,
                    description: market_description,
                    alpha: alpha,
                    initialLiquidity: initialLiquidity,
                    tradingFee: tradingFee,
                    events: events,
                    onSent: function (r) {
                        log("sent: " + JSON.stringify(r, null, 2));
                        is_object(r);
                        assert(!is_empty(r));
                        is_not_zero(r.id);
                        is_not_zero(r.txHash);
                        done();
                    },
                    onSuccess: function (r) {
                        log("createMarket: \"" + market_description + "\"");
                        log("success: " + JSON.stringify(r, null, 2));
                        is_object(r);
                        assert(!is_empty(r));
                        is_not_zero(r.id);
                        is_not_zero(r.txHash);
                        assert.equal(r.numOutcomes, numOutcomes);
                        assert.equal(parseFloat(r.alpha).toFixed(5), parseFloat(alpha).toFixed(5)); // rounding error
                        assert.equal(r.numOutcomes, numOutcomes);
                        assert.equal(r.tradingFee, tradingFee);
                        assert.equal(r.description, market_description);
                        done();
                    },
                    onFailed: function (r) {
                        log("createMarket: \"" + market_description + "\"");
                        log("failed: " + JSON.stringify(r, null, 2));
                        is_object(r);
                        assert(!is_empty(r));
                        done();
                    }
                };
                // Augur.createMarket(marketObj);
                done();
            });
        });
    });

    // closeMarket.se
    describe("closeMarket.se", function () {
        describe("closeMarket(" + branch_id + ", " + market_id + ") [call] ", function () {
            it("async", function (done) {
                Augur.tx.closeMarket.send = false;
                Augur.tx.closeMarket.returns = "number";
                Augur.closeMarket(branch_id, market_id, function (r) {
                    log("closeMarket: " + r);
                    done();
                });
                Augur.tx.closeMarket.send = true;
                Augur.tx.closeMarket.returns = undefined;
            });
        });
    });

    // dispatch.se
    describe("dispatch.se", function () {
        describe("dispatch(" + branch_number + ") [call] ", function () {
            it("async", function (done) {
                Augur.tx.dispatch.send = false;
                Augur.tx.dispatch.returns = "number";
                Augur.dispatch(branch_number, function (r) {
                    log("dispatch: " + r);
                    done();
                });
                Augur.tx.dispatch.send = true;
                Augur.tx.dispatch.returns = undefined;
            });
        });
    });
});
