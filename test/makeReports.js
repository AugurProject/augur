/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var path = require("path");
var BigNumber = require("bignumber.js");
var assert = require("chai").assert;
var constants = require("../src/constants");
var utilities = require("../src/utilities");
var Augur = utilities.setup(require("../src"), process.argv.slice(2));
var log = console.log;

var branch_id = Augur.branches.dev;
var salt = "1337";

var accounts = utilities.get_test_accounts(Augur, constants.max_test_accounts);

var period = Augur.getCurrentVotePeriod(branch_id);
var num_events = Augur.getNumberEvents(branch_id, period);
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
        this.timeout(constants.timeout);

        // make report
        var report = {
            branchId: branch_id,
            report: ballot,
            votePeriod: Augur.getCurrentVotePeriod(branch_id),
            salt: salt,
            onSent: function (res) {
                log("report sent: " + JSON.stringify(res));
            },
            onSuccess: function (res) {
                log("report success: " + JSON.stringify(res));
            },
            onFailed: function (res) {
                throw new Error(res);
                done();
            }
        };
        Augur.report(report);
    });

    it("submit report hash and check validity", function (done) {

        // submit report hash
        this.timeout(constants.timeout);
        var reportHashObj = {
            branchId: branch_id,
            reportHash: Augur.hash(JSON.stringify(ballot)),
            votePeriod: Augur.getCurrentVotePeriod(branch_id),
            onSent: function (res) {
                log("submitReportHash sent: " + JSON.stringify(res, null, 2));
            },
            onSuccess: function (res) {
                log("submitReportHash success: " + JSON.stringify(res, null, 2));

                // check report validity
                this.timeout(constants.timeout);
                var checkReportObj = {
                    branchId: branch_id,
                    report: ballot,
                    votePeriod: Augur.getCurrentVotePeriod(branch_id),
                    onSent: function (res) {
                        log("checkReportValidity sent: " + JSON.stringify(res, null, 2));
                    },
                    onSuccess: function (res) {
                        log("checkReportValidity success: " + JSON.stringify(res, null, 2));
                        done();
                    },
                    onFailed: function (res) {
                        throw new Error(res);
                        done();
                    }
                };
                Augur.checkReportValidity(checkReportObj);
            },
            onFailed: function (res) {
                throw new Error(res);
                done();
            }
        };
        Augur.submitReportHash(reportHashObj);
    });

    it("slash account " + accounts[0] + "'s reputation", function (done) {
        this.timeout(constants.timeout);
        var slashRepObj = {
            branchId: branch_id,
            votePeriod: Augur.getCurrentVotePeriod(branch_id),
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
            onFailed: function (res) {
                throw new Error(res);
                done();
            }
        };
        Augur.slashRep(slashRepObj);
    });

});
