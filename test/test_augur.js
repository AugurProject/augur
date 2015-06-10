/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var assert = require("assert");
var Augur = require("../augur");
var constants = require("./constants");

Augur.connect();

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
    assert(r.branch === Augur.branches.dev);
}
function is_not_zero(r) {
    assert(r.id && r.id !== "0" && r.id !== "0x" && r.id !== "0x0" && parseInt(r) !== 0);
}

describe("Augur API", function () {

    var amount = "1";
    var branch_id = Augur.branches.dev;
    var branch_number = "1";
    var participant_id = constants.accounts.jack;
    var participant_number = "1";
    var outcome = Augur.NO.toString();
    var event_id = "0xfe56aaf4c27c86989616147f4219097b1b9ae015d05e1761a82d402c664ef89d";
    var event_info_1 = {
        branch: '0x00000000000000000000000000000000000000000000000000000000000f69b5',
        expirationDate: '492149',
        outcome: '0',
        minValue: '0',
        maxValue: '1',
        numOutcomes: '2',
        description: 'future'
    };
    var market_id = "0x70f56a29596a7455b35a4666ddd572c564a4cbad14af32cd68b8774cecc0083a";
    var market_creator_1 = "0x63524e3fe4791aefce1e932bbfb3fdf375bfad89";
    var market_info_1 = {
        currentParticipant: '0',
        alpha: '0.00790000000000000001',
        cumulativeScale: '1',
        numOutcomes: '2',
        tradingPeriod: '24607',
        tradingFee: '0.01999999999999999998',
        description: 'future'
    };
    var market_id2 = "0x027f0086d94c77658eea3b954809c35c95bd8b8ff1a1cdb0df7a055c2a2ea823";
    var market_creator_2 = "0x63524e3fe4791aefce1e932bbfb3fdf375bfad89";
    var market_info_2 = {
        currentParticipant: '0',
        alpha: '0.00790000000000000001',
        cumulativeScale: '1',
        numOutcomes: '2',
        tradingPeriod: '24584',
        tradingFee: '0.01999999999999999998',
        description: 'is it lel time?'
    };
    var event_description = "[augur.js] " + Math.random().toString(36).substring(4);
    var market_description = "[augur.js] " + Math.random().toString(36).substring(4);
    var reporter_index = "0";
    var reporter_address = constants.accounts.jack;
    var ballot = [Augur.YES, Augur.YES, Augur.NO, Augur.YES];
    var salt = "1337";
    var receiving_account = constants.accounts.joeykrug;
    var vote_period = 1;

    // cash.se
    describe("cash.se", function () {
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
        describe("getCreator(" + event_id + ") [event]", function () {
            it("sync", function () {
                var res = Augur.getCreator(event_id);
                assert.equal(res, constants.accounts.jack);
            });
            it("async", function (done) {
                Augur.getCreator(event_id, function (r) {
                    assert.equal(r, constants.accounts.jack);
                    done();
                });
            });
        });
        describe("getCreator(" + market_id + ") [market]", function () {
            it("sync", function () {
                var res = Augur.getCreator(market_id);
                assert.equal(res, constants.accounts.jack);
            });
            it("async", function (done) {
                Augur.getCreator(market_id, function (r) {
                    assert.equal(r, constants.accounts.jack);
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
                assert.equal(res, "100");
            });
            it("async", function (done) {
                Augur.getCreationFee(market_id, function (r) {
                    assert.equal(r, "100");
                    done();
                });
            });
        });
        describe("getDescription(" + event_id + ")", function () {
            it("sync", function () {
                var res = Augur.getDescription(event_id);
                assert.equal(res, event_info_1.description);
            });
            it("async", function (done) {
                Augur.getDescription(event_id, function (r) {
                    assert.equal(r, event_info_1.description);
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
        describe("getMarkets(" + branch_id + ")", function () {
            var test = function (r) {
                is_array(r);
                assert(r.length > 2);
                assert.equal(r[0], "0xd8fb9d0b319667d10be2c26a5a8fb431fef22f3510697b81dda9801cf5494cf3");
                assert.equal(r[1], "0xcc1003282a0f980c362d9e9e3a5a14cc4c04ee0ecced124755e1a6611e3d07d8");
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
        describe("getPeriodLength(" + branch_id + ") == '300'", function () {
            var test = function (r) {
                assert.equal(r, "300");
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
        describe("getVotePeriod(" + branch_id + ") >= 1096", function () {
            var test = function (r) {
                assert(parseInt(r) >= 1096);
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
        describe("getNumMarkets(" + branch_id + ") >= 6", function () {
            var test = function (r) {
                assert(parseInt(r) >= 6);
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
                assert.equal(res.expirationDate, "30000000");
                assert.equal(res.description, "[augur.js] dbk7kieqjxxbt9");
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
        describe("getExpiration(" + event_id + ") == '30000000'", function () {
            var test = function (r) {
                assert.equal(r, "30000000");
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
                // this.timeout(30000);
                var amount = (Math.random() * 10).toString();
                Augur.buyShares({
                    branchId: branch_id,
                    marketId: market_id,
                    outcome: outcome,
                    amount: amount,
                    nonce: null,
                    onSent: function (r) {
                        log(r);
                    },
                    onSuccess: function (r) {
                        log(r); done();
                    },
                    onFailed: function (r) {
                        assert(r.error === "-1");
                        done();
                    }
                });
            });
        });
        describe("sellShares(" + branch_id + ", " + market_id + ", " + outcome + ", " + amount + ", null)", function () {
            it("async", function (done) {
                // this.timeout(30000);
                var amount = (Math.random() * 10).toString();
                Augur.sellShares({
                    branchId: branch_id,
                    marketId: market_id,
                    outcome: outcome,
                    amount: amount,
                    nonce: null,
                    onSent: function (r) {
                        log(r);
                    },
                    onSuccess: function (r) {
                        log(r); done();
                    },
                    onFailed: function (r) {
                        assert(r.error === "-1");
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
            var test = function (r) {
                is_not_zero(r);
                assert.equal(r, amount);
            };
            it("sync", function () {
                Augur.tx.sendReputation.send = false;
                Augur.tx.sendReputation.returns = "unfix";
                test(Augur.sendReputation(branch_id, receiving_account, amount));
            });
            it("async", function (done) {
                Augur.tx.sendReputation.send = false;
                Augur.tx.sendReputation.returns = "unfix";
                Augur.sendReputation(branch_id, receiving_account, amount, function (r) {
                    test(r); done();
                });
            });
        });
    });

    // transferShares.se

    // createEvent.se
    describe("createEvent.se", function () {
        describe("createEvent: \"" + event_description + "\"", function () {
            it("complete call-send-confirm callback sequence", function (done) {
                this.timeout(120000);
                var branch_id = "0x00000000000000000000000000000000000000000000000000000000000f69b5";
                var event_description = "Will Jack win the June 2015 Augur Breakdancing Competition?";
                var expDate = 500080 + Math.round(Math.random() * 1000);
                var minValue = 0;
                var maxValue = 1;
                var numOutcomes = 2;
                var eventObj = {
                    branchId: branch_id,
                    description: event_description,
                    expDate: expDate,
                    minValue: minValue,
                    maxValue: maxValue,
                    numOutcomes: numOutcomes,
                    onSent: function (r) {
                        log("sent: " + JSON.stringify(r, null, 2));
                    },
                    onSuccess: function (r) {
                        log("success: " + JSON.stringify(r, null, 2));
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
                        done();
                    }
                };
                Augur.createEvent(eventObj);
                // done();
            });
        });
    });

    // closeMarket.se
    describe("closeMarket.se", function () {
        describe("closeMarket(" + branch_id + ", " + market_id + ") [call] ", function () {
            it("complete call-send-confirm callback sequence", function (done) {
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
        describe("dispatch(" + branch_id + ")", function () {
            var test = function (r) {
                assert(r.error);
                assert(r.message);
                assert.equal(r.error, "-1");
            };
            it("complete call-send-confirm callback sequence", function (done) {
                this.timeout(120000);
                var dispatchObj = {
                    branchId: branch_id,
                    onSent: function (r) {
                        test(r);
                    },
                    onSuccess: function (r) {
                        test(r); done();
                    },
                    onFailed: function (r) {
                        test(r); done();
                    }
                };
                Augur.dispatch(dispatchObj);
            });
        });
    });
});
