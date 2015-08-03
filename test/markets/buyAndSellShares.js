/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var assert = require("chai").assert;
var longjohn = require("longjohn");
var chalk = require("chalk");
var constants = require("../../src/constants");
var utilities = require("../../src/utilities");
var Augur = utilities.setup(require("../../src"), process.argv.slice(2));
var log = console.log;

longjohn.async_trace_limit = 25;
longjohn.empty_frame = "";

require('it-each')({ testPerIteration: true });

var branch = Augur.branches.dev;
var outcome = "1.0";

var eventsMarkets = fs.readFileSync("../../data/events.dat").toString().split('\n');

// log("\n  Search for events");
var events, period;
for (var i = 0; i < 200; ++i) {
    events = Augur.getEvents(branch, i);
    if (events && events.length && events.length > 1) {
        // log(chalk.green("   ✓ ") + chalk.gray("Found " + events.length) +
        //     chalk.gray(" events in vote period " + i));
        period = i;
        break;
    }
}
describe("Search for events", function () {
    it("events should be a non-empty array", function () {
        assert(events);
        assert.strictEqual(events.constructor, Array);
        assert(events.length);
    });
});

if (events.length) {
    var markets = new Array(events.length);
    // log("\n  Lookup markets");
    var market, found;
    for (var i = 0; i < eventsMarkets.length; ++i) {
        found = false;
        market = eventsMarkets[i].split(',');
        for (var j = 0; j < events.length; ++j) {
            if (market[0] === events[j]) {
                markets[i] = market[1];
                found = true;
                break;
            }
        }
        // if (found) {
        //     log(chalk.green("   ✓ ") + chalk.gray("Found ") +
        //         chalk.gray("market for event " + events[j]));
        // } else {
        //     log(chalk.red("Found market for event " + events[j]));
        // }
    }

    describe("Market/event lookup", function () {
        it("should have the same number of events and markets", function () {
            assert.strictEqual(events.length, markets.length);
        });
    });
        
    describe("Buy and sell shares", function () {
        var markets = Augur.getMarkets(branch);
        markets = markets.slice(markets.length - 1);
        it.each(markets, "getNonce: %s", ['element'], function (element, next) {
            var test = function (r) {
                assert(Number(r) >= 0);
            };
            Augur.getNonce(element, function (r) {
                test(r); next();
            });
        });
        it.each(markets, "buyShares: %s", ['element'], function (element, next) {
            this.timeout(constants.TIMEOUT);
            var amount = "10";
            Augur.buyShares({
                branchId: branch,
                marketId: element,
                outcome: outcome,
                amount: amount,
                nonce: null,
                onSent: function (r) {
                    assert(parseInt(r.callReturn) > 0);
                },
                onSuccess: function (r) {
                    assert(r.txHash);
                    assert(parseInt(r.callReturn) > 0);
                    next();
                },
                onFailed: function (r) {
                    r.name = r.error; throw r;
                    next();
                }
            });
        });
        it.each(markets, "sellShares: %s", ['element'], function (element, next) {
            this.timeout(constants.TIMEOUT);
            var amount = "1";
            Augur.sellShares({
                branchId: branch,
                marketId: element,
                outcome: outcome,
                amount: amount,
                nonce: null,
                onSent: function (r) {
                    assert(parseInt(r.callReturn) > 0);
                },
                onSuccess: function (r) {
                    assert(r.txHash);
                    assert(parseInt(r.callReturn) > 0);
                    next();
                },
                onFailed: function (r) {
                    r.name = r.error; throw r;
                    next();
                }
            });
        });
    });
}