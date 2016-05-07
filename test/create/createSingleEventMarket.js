/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var async = require("async");
var assert = require("chai").assert;
var abi = require("augur-abi");
var augurpath = "../../src/index";
var augur = require(augurpath);
var runner = require("../runner");
var tools = require("../tools");

describe("Unit tests", function () {
    runner("eth_sendTransaction", [{
        method: "createSingleEventMarket",
        parameters: ["hash", "string", "int", "int", "int", "int", "fixed", "fixed", "fixed", "intString"]
    }]);
});

describe("Integration tests", function () {

    before(function () {
        augur = tools.setup(tools.reset(augurpath), process.argv.slice(2));
    });

    describe("createSingleEventMarket", function () {

        var test = function (t) {
            it(t.numOutcomes + " outcomes on [" + t.minValue + ", " + t.maxValue + "]", function (done) {
                this.timeout(tools.TIMEOUT);
                var initialLiquidity = t.initialLiquidityFloor + Math.round(Math.random() * 10);
                augur.createSingleEventMarket({
                    branchId: t.branch,
                    description: t.description,
                    expirationBlock: t.expirationBlock,
                    minValue: t.minValue,
                    maxValue: t.maxValue,
                    numOutcomes: t.numOutcomes,
                    alpha: t.alpha,
                    initialLiquidity: initialLiquidity,
                    tradingFee: t.tradingFee,
                    onSent: function (r) {
                        assert(r.txHash);
                        assert(r.callReturn);
                    },
                    onSuccess: function (r) {
                        var marketID = r.callReturn;
                        assert.strictEqual(augur.getCreator(marketID), augur.coinbase);
                        assert.strictEqual(augur.getDescription(marketID), t.description);
                        augur.getMarketEvents(marketID, function (eventList) {
                            assert.isArray(eventList);
                            assert.strictEqual(eventList.length, 1);
                            augur.getDescription(eventList[0], function (description) {
                                assert.strictEqual(description, t.description);
                                augur.getMarketInfo(marketID, function (info) {
                                    if (info.error) return done(info);
                                    assert.isArray(info.events);
                                    assert.strictEqual(info.events.length, 1);
                                    var metadata = t.metadata;
                                    metadata.marketId = marketID;
                                    augur.ramble.addMetadata(t.metadata, function (res) {
                                        assert.strictEqual(res.callReturn, "1");
                                    }, function (res) {
                                        assert.strictEqual(res.callReturn, "1");
                                        done();
                                    }, done);
                                    done();
                                });
                            });
                        });
                    },
                    onFailed: function (err) {
                        done(new Error(tools.pp(err)));
                    }
                });
            });
        };

        test({
            branch: augur.branches.dev,
            description: "Will SpaceX successfully complete a manned flight to the International Space Station by the end of 2018?",
            expirationBlock: tools.date_to_block(augur, "1-1-2019"),
            minValue: 1,
            maxValue: 2,
            numOutcomes: 2,
            alpha: "0.0079",
            tradingFee: "0.02",
            initialLiquidityFloor: 1000,
            metadata: {
                details: "SpaceX hit a big milestone on Friday with NASA confirming on Friday that the Elon Musk-led space cargo business will launch astronauts to the International Space Station by 2017.\n\nLast year, the space agency tentatively awarded a $2.6 billion contract to SpaceX to carry crew to space. NASA’s announcement on Friday formalizes the deal, which involves SpaceX loading its Crew Dragon spacecraft with astronauts and sending them beyond the stratosphere.",
                tags: ["space", "Dragon", "ISS"],
                source: "generic",
                broadcast: true,
                links: [
                    "http://fortune.com/2015/11/20/spacex-astronauts-international-space-station/",
                    "http://www.spacex.com"
                ]
            }
        });

        test({
            branch: augur.branches.dev,
            description: "Which political party's candidate will win the 2016 U.S. Presidential Election? Choices: Democratic, Republican, Libertarian, other",
            expirationBlock: tools.date_to_block(augur, "1-3-2017"),
            minValue: 10,
            maxValue: 20,
            numOutcomes: 4,
            alpha: "0.0079",
            tradingFee: "0.02",
            initialLiquidityFloor: 1000,
            metadata: {
                details: "The United States presidential election of 2016, scheduled for Tuesday, November 8, 2016, will be the 58th quadrennial U.S. presidential election.",
                tags: ["politics", "US elections", "political parties"],
                source: "generic",
                broadcast: true,
                links: [
                    "https://en.wikipedia.org/wiki/United_States_presidential_election,_2016"
                ]
            }
        });

    });
});
