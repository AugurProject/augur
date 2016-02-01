/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var _ = require("lodash");
var chalk = require("chalk");
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));
var constants = augur.constants;

require('it-each')({ testPerIteration: true });

if (!process.env.CONTINUOUS_INTEGRATION) {

    var minValue = 1;
    var maxValue = 2;
    var numOutcomes = 2;
    var num_events = 2;
    var branch = augur.branches.dev;
    var period = augur.getVotePeriod(branch);
    var expirationBlock = augur.rpc.blockNumber() + 25000;

    describe("Creating " + num_events + " events and markets", function () {
        var events = [];
        it.each(_.range(0, num_events), "create event/market %s", ['element'], function (element, next) {
            this.timeout(constants.TIMEOUT);
            var description = Math.random().toString(36).substring(4);
            augur.createEvent({
                branchId: branch,
                description: description,
                expirationBlock: expirationBlock,
                minValue: minValue,
                maxValue: maxValue,
                numOutcomes: numOutcomes,
                onSent: function (r) {
                    // console.log(chalk.green("    ✓ ") + chalk.gray("event hash:  " + r.txHash));
                    // console.log(chalk.green("    ✓ ") + chalk.gray("event ID:    " + r.callReturn));
                    assert(r.txHash);
                    assert(r.callReturn);
                },
                onSuccess: function (r) {
                    var eventID = r.callReturn;
                    assert.strictEqual(augur.getCreator(eventID), augur.coinbase);
                    assert.strictEqual(augur.getDescription(eventID), description);
                    next();
                },
                onFailed: function (r) {
                    next(new Error(utils.pp(r)));
                }
            }); // createEvent
        });
    });
}
