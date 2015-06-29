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
var TIMEOUT = 24000;

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

var amount = "1";
var branch_id = Augur.branches.dev;
var branch_number = "0";
var participant_id = constants.test_accounts[0];
var participant_number = "1";
var outcome = Augur.NO.toString();
var markets = Augur.getMarkets(branch_id);
var market_id = markets[0];
var market_creator_1 = constants.test_accounts[0];
var market_id2 = markets[1];
var market_creator_2 = constants.test_accounts[0];
var event_id = Augur.getMarketEvents(market_id)[0];
var reporter_index = "0";
var reporter_address = constants.test_accounts[0];
var ballot = [Augur.YES, Augur.YES, Augur.NO, Augur.YES];
var salt = "1337";
var receiving_account = constants.test_accounts[1];
var vote_period = Augur.getVotePeriod(branch_id);

// info.se
describe("info.se", function () {
    describe("getCreator(" + event_id + ") [event]", function () {
        it("sync", function () {
            var res = Augur.getCreator(event_id);
            assert.equal(res, constants.test_accounts[0]);
        });
        it("async", function (done) {
            Augur.getCreator(event_id, function (r) {
                assert.equal(r, constants.test_accounts[0]);
                done();
            });
        });
    });
    describe("getCreator(" + market_id + ") [market]", function () {
        it("sync", function () {
            var res = Augur.getCreator(market_id);
            assert.equal(res, constants.test_accounts[0]);
        });
        it("async", function (done) {
            Augur.getCreator(market_id, function (r) {
                assert.equal(r, constants.test_accounts[0]);
                done();
            });
        });
    });
    describe("getCreationFee(" + event_id + ") [event]", function () {
        var test = function (r) {
            assert.equal(r, "0.00000000000000000244");
        };
        it("sync", function () {
            test(Augur.getCreationFee(event_id));
        });
        it("async", function (done) {
            Augur.getCreationFee(event_id, function (r) {
                test(r); done();
            });
        });
    });
    describe("getCreationFee(" + market_id + ") [market]", function () {
        var test = function (r) {
            assert.equal(r, "1000");
        };
        it("sync", function () {
            test(Augur.getCreationFee(market_id));
        });
        it("async", function (done) {
            Augur.getCreationFee(market_id, function (r) {
                test(r); done();
            });
        });
    });
    describe("getDescription(" + event_id + ")", function () {
        var test = function (r) {
            assert.equal(r.length, 13);
        };
        it("sync", function () {
            test(Augur.getDescription(event_id));
        });
        it("async", function (done) {
            Augur.getDescription(event_id, function (r) {
                test(r); done();
            });
        });
    });
});

// branches.se
describe("branches.se", function () {
    describe("getBranches", function () {
        var test = function (r) {
            assert.equal(r.constructor, Array);
            assert.equal(r.length, 1);
            assert.equal(r[0], branch_id);
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
            assert.equal(r.constructor, Array);
            assert(r.length > 1);
            assert.equal(r[0], markets[0]);
            assert.equal(r[1], markets[1]);
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
    describe("getPeriodLength(" + branch_id + ") == '1800'", function () {
        var test = function (r) {
            assert.equal(r, "1800");
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
    describe("getVotePeriod(" + branch_id + ") in [-1, 100]", function () {
        var test = function (r) {
            assert(parseInt(r) >= -1);
            assert(parseInt(r) <= 100);
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
    describe("getStep(" + branch_id + ") == 0", function () {
        var test = function (r) {
            assert.equal(parseInt(r), 0);
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
    describe("getNumMarkets(" + branch_id + ") >= 1", function () {
        var test = function (r) {
            assert(parseInt(r) >= 1);
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
            assert(Number(r) >= 0.0);
            assert(Number(r) <= 1.0);
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
            assert.equal(parseInt(r), 1);
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
            assert.equal(r, branch_id);
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
            assert.equal(res[0], branch_id);
            assert.equal(res.length, 6);
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

    describe("getEventBranch(" + event_id + ")", function () {
        var test = function (r) {
            assert.equal(r, branch_id);
        };
        it("sync", function () {
            test(Augur.getEventBranch(event_id));
        });
        it("async", function (done) {
            Augur.getEventBranch(event_id, function (r) {
                test(r); done();
            });
        });
    });
    describe("getExpiration(" + event_id + ")", function () {
        var test = function (r) {
            assert(parseInt(r) >= 10);
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
    describe("getOutcome(" + event_id + ")", function () {
        var test = function (r) {
            assert.equal(r, "0");
        };
        it("sync", function () {
            test(Augur.getOutcome(event_id));
        });
        it("async", function (done) {
            Augur.getOutcome(event_id, function (r) {
                test(r); done();
            });
        });
    });
    describe("getMinValue(" + event_id + ") == '1'", function () {
        var test = function (r) {
            assert.equal(r, "0");
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
            assert.equal(r, "1");
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
describe("checkQuorum", function () {
    it("checkQuorum(" + branch_id + ")", function (done) {
        Augur.checkQuorum(branch_id, function (r) {
            assert(r.txHash);
            assert.equal(r.txHash.length, 66);
            assert(parseInt(r.callReturn) === 0 || parseInt(r.callReturn) === 1);
            done();
        });
    });
});

// createBranch.se
// p2pWagers.se
// transferShares.se
