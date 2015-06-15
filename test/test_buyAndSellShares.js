/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var assert = require("assert");
var async = require("async");
var chalk = require("chalk");
var Augur = require("../augur");
require('it-each')({ testPerIteration: true });

Augur.connect();

var log = console.log;
var TIMEOUT = 5000;

var branch = Augur.branches.dev;
var outcome = "1.0";

var eventsMarkets = fs.readFileSync("events.dat").toString().split('\n');

log("\n  Search for events");
var events, period;
for (var i = 0; i < 200; ++i) {
    events = Augur.getEvents(branch, i);
    if (events && events.length && events.length > 1) {
        log(chalk.green("   ✓ ") + chalk.gray("Found " + events.length) +
            chalk.gray(" events in vote period " + i));
        period = i;
        break;
    }
}
assert(events.length);
var markets = new Array(events.length);

log("\n  Lookup markets");
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
    assert(found);
    log(chalk.green("   ✓ ") + chalk.gray("Found ") +
        chalk.gray(" market for event " + events[j]));
}
    
describe("Buy and sell shares", function () {
    assert.equal(events.length, markets.length);
    it.each(markets, "getNonce: %s", ['element'], function (element, next) {
        var test = function (r) {
            assert(Number(r) >= 0);
        };
        Augur.getNonce(element, function (r) {
            test(r); next();
        });
    });
    it.each(markets, "buyShares: %s", ['element'], function (element, next) {
        this.timeout(TIMEOUT);
        var amount = "10";
        Augur.buyShares({
            branchId: branch,
            marketId: element,
            outcome: outcome,
            amount: amount,
            nonce: null,
            onSent: function (r) {
                log(r); next();
            },
            onSuccess: function (r) {
                log(r.callReturn); next();
            },
            onFailed: function (r) {
                throw(r.message); next();
            }
        });
    });
    it.each(markets, "sellShares: %s", ['element'], function (element, next) {
        this.timeout(TIMEOUT);
        var amount = "1";
        Augur.sellShares({
            branchId: branch,
            marketId: element,
            outcome: outcome,
            amount: amount,
            nonce: null,
            onSent: function (r) {
                log(r);
            },
            onSuccess: function (r) {
                log(r.callReturn); next();
            },
            onFailed: function (r) {
                throw(r.message); next();
            }
        });
    });
});
