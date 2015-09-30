(function () {
/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var path = require("path");
var assert = require("chai").assert;
var _ = require("lodash");
var chalk = require("chalk");
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));
var constants = augur.constants;
var log = console.log;

require('it-each')({ testPerIteration: true });

if (!process.env.CONTINUOUS_INTEGRATION) {

    var minValue = 0;
    var maxValue = 1;
    var numOutcomes = 2;
    var num_events = 1;
    var branch = augur.branches.dev;
    var period = augur.getVotePeriod(branch);
    var exp_date = augur.rpc.blockNumber() + 2500;

    var datafile = path.join(__dirname, "..", "..", "data", "events.dat");
    fs.writeFileSync(datafile, "");

    describe("Creating " + num_events + " events and markets", function () {
        var events = [];
        it.each(_.range(0, num_events), "create event/market %s", ['element'], function (element, next) {
            this.timeout(constants.TIMEOUT*4);
            var augur = utils.setup(require("../../src"), process.argv.slice(2));
            var event_description = Math.random().toString(36).substring(4);

            augur.createEvent({
                branchId: branch,
                description: event_description,
                expDate: exp_date,
                minValue: minValue,
                maxValue: maxValue,
                numOutcomes: numOutcomes,
                onSent: function (r) {
                    // log(chalk.green("    ✓ ") + chalk.gray("event hash:  " + r.txHash));
                    // log(chalk.green("    ✓ ") + chalk.gray("event ID:    " + r.callReturn));
                },
                onSuccess: function (r) {
                    var alpha = "0.0079";
                    var initialLiquidity = 10;
                    var tradingFee = "0.02";
                    var events = [ r.callReturn ];
                    var market_description = event_description;

                    augur.createMarket({
                        branchId: augur.branches.dev,
                        description: market_description,
                        alpha: alpha,
                        initialLiquidity: initialLiquidity,
                        tradingFee: tradingFee,
                        events: events,
                        onSent: function (res) {
                            // log(chalk.green("    ✓ ") + chalk.gray("market hash: " + res.txHash));
                            // log(chalk.green("    ✓ ") + chalk.gray("market ID:   " + res.callReturn));
                        },
                        onSuccess: function (res) {
                            if (element < num_events - 1) {
                                fs.appendFile(datafile, events[0] + "," + res.callReturn + "\n");
                            } else {
                                fs.appendFile(datafile, events[0] + "," + res.callReturn);
                            }
                            next();
                        },
                        onFailed: function (res) {
                            next(res);
                        }
                    }); // createMarket
                
                },
                onFailed: function (r) {
                    next(r);
                }
            }); // createEvent

        });
    });

}

})();
