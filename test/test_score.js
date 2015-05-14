/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("assert");
var Augur = require("../augur");
var constants = require("./constants");

Augur.connect();

var log = console.log;
var TIMEOUT = 120000;
var num_components = "2";
var num_iterations = "5";
var branch = Augur.branches.dev;
var period = Augur.getVotePeriod(branch);
var num_events = Augur.getNumberEvents(branch, period);
var num_reports = Augur.getNumberReporters(branch);
var flatsize = num_events * num_reports;
var reputation_vector = [
    Augur.getRepBalance(branch, Augur.coinbase),
    Augur.getRepBalance(branch, constants.chain10101.accounts.tinybike_new)
];
var ballot = new Array(num_events);
var reports = new Array(flatsize);
for (var i = 0; i < num_reports; ++i) {
    ballot = Augur.getReporterBallot(branch, period, Augur.getReporterID(branch, i));
    if (ballot[0] != 0) {
        for (var j = 0; j < num_events; ++j) {
            reports[i*num_events + j] = ballot[j];
        }
    }
}
var scaled = [];
var scaled_min = [];
var scaled_max = [];
for (var i = 0; i < num_events; ++i) {
    scaled.push(0);
    scaled_min.push(1);
    scaled_max.push(2);
}

describe("testing consensus/score", function () {

    it("blank", function (done) {
        this.timeout(TIMEOUT);
        Augur.blank(
            num_components,
            num_iterations,
            num_events,
            function (r) {
                // sent
            },
            function (r) {
                // success
                assert.equal(r.callReturn[0], "18446744073709551616");
                assert.equal(r.callReturn[1], "0");
                assert.equal(r.callReturn[r.callReturn.length-1], num_components);
                assert.equal(r.callReturn[r.callReturn.length-2], num_iterations);
                done();
            },
            function (r) {
                // failed
                throw("blank failed: " + r);
                done();
            }
        );
    });

    it("redeem_blank", function (done) {
        this.timeout(TIMEOUT);
        Augur.redeem_blank(
            branch,
            period,
            num_events,
            num_reports,
            flatsize,
            function (r) {
                // sent
            },
            function (r) {
                // success
                assert.equal(r.callReturn, "0x01")
                done();
            },
            function (r) {
                // failed
                throw("redeem_blank failed: " + r);
                done();
            }
        );
    });

    it("loadings", function (done) {
        this.timeout(TIMEOUT*4);
        Augur.blank(
            num_components,
            num_iterations,
            num_events,
            function (r) {
                // sent
            },
            function (r) {
                // success
                Augur.loadings(
                    Augur.unfix(r.callReturn.slice(0, num_events+2), "string"),
                    Augur.getWeightedCenteredData(branch, period).slice(0, flatsize),
                    reputation_vector,
                    num_reports,
                    num_events,
                    function (r) {
                        // sent
                    },
                    function (r) {
                        // success
                        var lv = r.callReturn;
                        log("loadings:");
                        log(Augur.unfix(lv.slice(0, lv.length-2), "string"));
                        log("remaining:");
                        log(lv.slice(lv.length-2, lv.length));
                        // assert.equal(lv[lv.length-2], num_iterations);
                        // assert.equal(lv[lv.length-1], num_components);
                        done();
                    },
                    function (r) {
                        // failed
                        throw("loadings failed: " + r);
                        done();
                    }
                );
            },
            function (r) {
                // failed
                throw("loadings (blank) failed: " + r);
                done();
            }
        );
    });

    it("redeem_loadings", function (done) {
        this.timeout(TIMEOUT);
        Augur.redeem_loadings(
            branch,
            period,
            num_events,
            num_reports,
            flatsize,
            function (r) {
                // sent
            },
            function (r) {
                // success
                log("redeem_loadings success:", r.callReturn);
                // assert.equal(r.callReturn, "0x01")
                done();
            },
            function (r) {
                // failed
                throw("redeem_loadings failed: " + r);
                done();
            }
        );
    });
});
