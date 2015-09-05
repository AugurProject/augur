/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var path = require("path");
var BigNumber = require("bignumber.js");
var assert = require("chai").assert;
var constants = require("../../src/constants");
var utilities = require("../../src/utilities");
var augur = utilities.setup(require("../../src"), process.argv.slice(2));
var log = console.log;

var branch_id = augur.branches.dev;
var salt = "1337";

var accounts = utilities.get_test_accounts(augur, constants.MAX_TEST_ACCOUNTS);

var period = augur.getCurrentVotePeriod(branch_id);
var num_events = augur.getNumberEvents(branch_id, period);
var ballot = new Array(num_events);
for (var i = 0; i < num_events; ++i) {
    ballot[i] = Math.random();
    if (ballot[i] > 0.6) {
        ballot[i] = 2.0;
    } else if (ballot[i] >= 0.4) {
        ballot[i] = 1.5;
    } else {
        ballot[i] = 1.0;
    }
}

// makeReports.se
describe("functions/makeReports", function () {

    it("submit report: " + JSON.stringify(ballot), function (done) {
        this.timeout(constants.TIMEOUT);

        // make report
        var report = {
            branchId: branch_id,
            report: ballot,
            votePeriod: augur.getCurrentVotePeriod(branch_id),
            salt: salt,
            onSent: function (res) {
                log("report sent: " + JSON.stringify(res));
            },
            onSuccess: function (res) {
                log("report success: " + JSON.stringify(res));
            },
            onFailed: function (r) {
                r.name = r.error; throw r;
                done();
            }
        };
        augur.report(report);
    });

    it("submit report hash and check validity", function (done) {

        // submit report hash
        this.timeout(constants.TIMEOUT);
        var reportHashObj = {
            branchId: branch_id,
            reportHash: augur.hash(JSON.stringify(ballot)),
            votePeriod: augur.getCurrentVotePeriod(branch_id),
            onSent: function (res) {
                log("submitReportHash sent: " + JSON.stringify(res, null, 2));
            },
            onSuccess: function (res) {
                log("submitReportHash success: " + JSON.stringify(res, null, 2));

                // check report validity
                this.timeout(constants.TIMEOUT);
                var checkReportObj = {
                    branchId: branch_id,
                    report: ballot,
                    votePeriod: augur.getCurrentVotePeriod(branch_id),
                    onSent: function (res) {
                        log("checkReportValidity sent: " + JSON.stringify(res, null, 2));
                    },
                    onSuccess: function (res) {
                        log("checkReportValidity success: " + JSON.stringify(res, null, 2));
                        done();
                    },
                    onFailed: function (r) {
                        r.name = r.error; throw r;
                        done();
                    }
                };
                augur.checkReportValidity(checkReportObj);
            },
            onFailed: function (r) {
                r.name = r.error; throw r;
                done();
            }
        };
        augur.submitReportHash(reportHashObj);
    });

    it("slash account " + accounts[0] + "'s reputation", function (done) {
        this.timeout(constants.TIMEOUT);
        var slashRepObj = {
            branchId: branch_id,
            votePeriod: augur.getCurrentVotePeriod(branch_id),
            salt: salt,
            report: ballot,
            reporter: accounts[0],
            onSent: function (res) {
                log("slashRep sent: " + JSON.stringify(res, null, 2));
            },
            onSuccess: function (res) {
                log("slashRep success: " + JSON.stringify(res, null, 2));
                done();
            },
            onFailed: function (r) {
                r.name = r.error; throw r;
                done();
            }
        };
        augur.slashRep(slashRepObj);
    });

});
