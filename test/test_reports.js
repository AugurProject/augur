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
var TIMEOUT = 120000;
var branch_id = Augur.branches.dev;
var salt = "1337";

// makeReports.se
describe("makeReports.se", function () {
    it("make reports, submit hash, check validity, slash rep", function (done) {
        this.timeout(TIMEOUT);
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

                // submit report hash
                this.timeout(TIMEOUT);
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
                        this.timeout(TIMEOUT);
                        var checkReportObj = {
                            branchId: branch_id,
                            report: ballot,
                            votePeriod: Augur.getCurrentVotePeriod(branch_id),
                            onSent: function (res) {
                                log("checkReportValidity sent: " + JSON.stringify(res, null, 2));
                            },
                            onSuccess: function (res) {
                                log("checkReportValidity success: " + JSON.stringify(res, null, 2));

                                // slash rep
                                this.timeout(TIMEOUT);
                                var slashRepObj = {
                                    branchId: branch_id,
                                    votePeriod: Augur.getCurrentVotePeriod(branch_id),
                                    salt: salt,
                                    report: ballot,
                                    reporter: constants.accounts.jack,
                                    onSent: function (res) {
                                        log("checkReportValidity sent: " + JSON.stringify(res, null, 2));
                                    },
                                    onSuccess: function (res) {
                                        log("checkReportValidity success: " + JSON.stringify(res, null, 2));
                                        done();
                                    },
                                    onFailed: function (res) {
                                        log("checkReportValidity failed: " + JSON.stringify(res, null, 2));
                                        done();
                                    }
                                };
                                Augur.slashRep(slashRepObj);
                            },
                            onFailed: function (res) {
                                log("checkReportValidity failed: " + JSON.stringify(res, null, 2));
                                done();
                            }
                        };
                        Augur.checkReportValidity(checkReportObj);
                    },
                    onFailed: function (res) {
                        log("checkReportValidity failed: " + JSON.stringify(res, null, 2));
                        done();
                    }
                };
                Augur.submitReportHash(reportHashObj);
            },
            onFailed: function (res) {
                log("checkReportValidity failed: " + JSON.stringify(res));
                done();
            }
        };
        Augur.report(report);
    });
});
