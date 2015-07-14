/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var chalk = require("chalk");
var constants = require("../src/constants");
var utilities = require("../src/utilities");
var Augur = utilities.setup(require("../src"), process.argv.slice(2));
var log = console.log;

require('it-each')({ testPerIteration: true });

var branch = Augur.branches.dev;
var period = Augur.getVotePeriod(branch);
var num_events = Augur.getNumberEvents(branch, period);
var num_reports = Augur.getNumberReporters(branch);
var flatsize = num_events * num_reports;
var reporters = utilities.get_test_accounts(Augur, constants.max_test_accounts);
var reputation_vector = [];
for (var i = 0; i < num_reports; ++i) {
    reputation_vector.push(Augur.getRepBalance(branch, reporters[i]));
}
log("Reputation:", chalk.cyan(JSON.stringify(reputation_vector)));
var ballot = new Array(num_events);
var reports = new Array(flatsize);
for (var i = 0; i < num_reports; ++i) {
    var reporterID = Augur.getReporterID(branch, i);
    ballot = Augur.getReporterBallot(branch, period, reporterID);
    if (ballot[0] != 0) {
        for (var j = 0; j < num_events; ++j) {
            reports[i*num_events + j] = ballot[j];
        }
    } else {
        for (var j = 0; j < num_events; ++j) {
            reports[i*num_events + j] = '0';
        }
    }
}
log("Reports:");
utilities.print_matrix(utilities.fold(reports, num_events));
// var scaled = [];
// var scaled_min = [];
// var scaled_max = [];
// for (var i = 0; i < num_events; ++i) {
//     scaled.push(0);
//     scaled_min.push(1);
//     scaled_max.push(2);
// }
// log("Scaled:");
// log(scaled);
// log("Scaled max:");
// log(scaled_max);
// log("Scaled min:");
// log(scaled_min);

describe("testing consensus: interpolate", function () {

    it("redeem_interpolate/read_ballots", function (done) {
        this.timeout(constants.timeout);
        Augur.read_ballots(
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
                assert.equal(r.callReturn, "0x01");
                done();
            },
            function (r) {
                // failed
                throw new Error("read_ballots failed:", r);
                done();
            }
        );
    });

    it("redeem_interpolate/interpolate", function (done) {
        this.timeout(constants.timeout);
        // Augur.tx.redeem_interpolate.returns = "unfix[]";
        Augur.redeem_interpolate(
            branch,
            period,
            num_events,
            num_reports,
            flatsize,
            function (r) {
                // sent
                // log(r.callReturn);
            },
            function (r) {
                // success
                // var i, reports_filled, reports_mask, v_size;
                assert.equal(r.callReturn, "0x01");
                // reports_filled = Augur.getReportsFilled(branch, period);
                // for (i = 0; i < num_events; ++i) {
                //     assert.equal(reports_filled[i], Augur.abi.fix(ballot[i], "string"));
                // }
                // reports_mask = Augur.getReportsMask(branch, period);
                // for (i = 0; i < num_events; ++i) {
                //     assert.equal(reports_mask[i], "0");
                // }
                // v_size = Augur.getVSize(branch, period);
                // assert.equal(parseInt(v_size), num_reports * num_events);
                done();
            },
            function (r) {
                // failed
                throw new Error(r.message);
                done();
            }
        );
    });
});
