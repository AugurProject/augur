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

if (process.env.AUGURJS_INTEGRATION_TESTS) {

    describe("Integration tests", function () {

        before(function () {
            augur = tools.setup(tools.reset(augurpath), process.argv.slice(2));
        });

        describe("createSingleEventMarket", function () {

            var test = function (t) {
                it(t.numOutcomes + " outcomes on [" + t.minValue + ", " + t.maxValue + "]", function (done) {
                    this.timeout(tools.TIMEOUT);
                    augur.createSingleEventMarket({
                        branchId: t.branch,
                        description: t.description,
                        expDate: t.expDate,
                        minValue: t.minValue,
                        maxValue: t.maxValue,
                        numOutcomes: t.numOutcomes,
                        takerFee: t.takerFee,
                        makerFee: t.makerFee,
                        tags: t.tags,
                        extraInfo: t.extraInfo,
                        resolution: t.resolution,
                        onSent: function (r) {
                            // console.log(r)
                            assert(r.txHash);
                            assert(r.callReturn);
                        },
                        onSuccess: function (r) {
                            // console.log(r);
                            var marketID = r.marketID;
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
                expDate: new Date("1/1/2019").getTime() / 1000,
                minValue: 1,
                maxValue: 2,
                numOutcomes: 2,
                takerFee: "0.02",
                makerFee: "0.01",
                extraInfo: "SpaceX hit a big milestone on Friday with NASA confirming on Friday that the Elon Musk-led space cargo business will launch astronauts to the International Space Station by 2017.\n\nLast year, the space agency tentatively awarded a $2.6 billion contract to SpaceX to carry crew to space. NASA’s announcement on Friday formalizes the deal, which involves SpaceX loading its Crew Dragon spacecraft with astronauts and sending them beyond the stratosphere.",
                tags: ["space", "Dragon", "ISS"],
                resolution: "generic"
            });

            test({
                branch: augur.branches.dev,
                description: "Which political party's candidate will win the 2016 U.S. Presidential Election?~|>Democratic|Republican|Libertarian|other",
                expDate: new Date("1/2/2017").getTime() / 1000,
                minValue: 1,
                maxValue: 2,
                numOutcomes: 4,
                takerFee: "0.02",
                makerFee: "0.005",
                extraInfo: "The United States presidential election of 2016, scheduled for Tuesday, November 8, 2016, will be the 58th quadrennial U.S. presidential election.",
                tags: ["politics", "US elections", "political parties"],
                resolution: "generic"
            });

        });
    });

}
