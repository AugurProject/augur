/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var path = require("path");
var assert = require("chai").assert;
var chalk = require("chalk");
var Augur = require("../augur");
var constants = require("./constants");
require('it-each')({ testPerIteration: true });

var args = process.argv.slice(2);
if (args.length && (args[0] === "--gospel" || args[0] === "--reset" || args[0] === "--postupload" || args[0] === "--faucets" || args[0] === "--ballots")) {
    var gospel = path.join(__dirname, "gospel.json");
    Augur.contracts = JSON.parse(fs.readFileSync(gospel));
}
Augur.connect();

var log = console.log;
var TIMEOUT = 240000;

function print_matrix(m) {
    for (var i = 0, rows = m.length; i < rows; ++i) {
        process.stdout.write("\t");
        for (var j = 0, cols = m[0].length; j < cols; ++j) {
            process.stdout.write(chalk.cyan(m[i][j] + "\t"));
        }
        process.stdout.write("\n");
    }
}

var branch = Augur.branches.dev;
var period = Augur.getVotePeriod(branch);
var num_events = Augur.getNumberEvents(branch, period);
var num_reports = Augur.getNumberReporters(branch);
var flatsize = num_events * num_reports;
var reporters = constants.test_accounts;
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
print_matrix(Augur.fold(reports, num_events));
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

    it("interpolate", function (done) {
        this.timeout(TIMEOUT);
        assert.equal(reports.length, flatsize);
        assert.equal(reputation_vector.length, num_reports);
        Augur.interpolate(
            reports,
            reputation_vector,
            // scaled,
            // scaled_max,
            // scaled_min,
            function (r) {
                // sent
                // print_matrix(
                //     Augur.fold(Augur.unfix(r.callReturn, "number"),
                //         num_events)
                // );
            },
            function (r) {
                // success
                var interpolated = Augur.unfix(r.callReturn, "number");
                var reports_filled = Augur.fold(
                    interpolated.slice(0, flatsize),
                    num_events
                );
                var reports_mask = Augur.fold(
                    Augur.fix(interpolated.slice(flatsize, 2*flatsize), "string"),
                    num_events
                );
                log("Reports (filled):");
                print_matrix(reports_filled)
                log("Reports mask:");
                print_matrix(reports_mask);
                done();
            },
            function (r) {
                //failed
                throw r.message;
                done();
            }
        );
    });

    it("redeem_interpolate/read_ballots", function (done) {
        this.timeout(TIMEOUT);
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
                log("read_ballots failed:", r);
                done();
            }
        );
    });

    it("redeem_interpolate/interpolate", function (done) {
        this.timeout(TIMEOUT);
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
                //     assert.equal(reports_filled[i], Augur.fix(ballot[i], "string"));
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
                log(r.message);
                done();
            }
        );
    });
});
