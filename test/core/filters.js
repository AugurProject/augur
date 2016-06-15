/**
 * price logging/filter tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var join = require("path").join;
var async = require("async");
var BigNumber = require("bignumber.js");
var locks = require("locks");
var chalk = require("chalk");
var assert = require("chai").assert;
var abi = require("augur-abi");
var madlibs = require("madlibs");
var tools = require("../tools");
var constants = require("../../src/constants");
var augurpath = "../../src/index";
var augur = tools.setup(require(augurpath), process.argv.slice(2));
var password = fs.readFileSync(join(process.env.HOME, ".ethereum", ".password")).toString();
var accounts = augur.rpc.personal("listAccounts");

var DELAY = 2500;
var branch = augur.branches.dev;
var markets = augur.getMarketsInBranch(branch);
var numMarkets = markets.length;
var marketId, marketInfo;
do {
    marketId = markets[--numMarkets];
    marketInfo = augur.getMarketInfo(marketId);
} while (marketInfo.type === "combinatorial");
var outcome = "1";
var amount = "1";
var sellAmount = (Number(amount) / 2).toString();
var newMarketId;

function trade(done, augur) {
    augur.rpc.personal("unlockAccount", [accounts[0], password]);
    augur.from = accounts[0];
    augur.connector.from_field_tx(accounts[0]);
    augur.sync(augur.connector);
    augur.buyCompleteSets({
        market: marketId,
        amount: amount,
        onSent: function (r) {},
        onSuccess: function (r) {
            augur.sell({
                amount: amount,
                price: "0.01",
                market: marketId,
                outcome: outcome,
                onSent: function (r) {},
                onSuccess: function (r) {
                    augur.from = accounts[2];
                    augur.connector.from_field_tx(accounts[2]);
                    augur.sync(augur.connector);
                    augur.get_trade_ids(marketId, function (trade_ids) {
                        async.eachSeries(trade_ids, function (thisTrade, nextTrade) {
                            augur.get_trade(thisTrade, function (tradeInfo) {
                                if (!tradeInfo) return nextTrade("no trade info found");
                                if (tradeInfo.owner === augur.from) return nextTrade();
                                if (tradeInfo.type === "buy") return nextTrade();
                                console.log("matched trade:", thisTrade, tradeInfo);
                                augur.rpc.personal("unlockAccount", [accounts[2], password]);
                                augur.trade({
                                    max_value: amount,
                                    max_amount: 0,
                                    trade_ids: [thisTrade],
                                    onTradeHash: function (r) {
                                        assert.notProperty(r, "error");
                                        assert.isString(r);
                                    },
                                    onCommitSent: function (r) {
                                        assert.strictEqual(r.callReturn, "1");
                                    },
                                    onCommitSuccess: function (r) {
                                        assert.strictEqual(r.callReturn, "1");
                                    },
                                    onCommitFailed: nextTrade,
                                    onTradeSent: function (r) {
                                        console.log("trade sent:", r)
                                        assert.isArray(r.callReturn);
                                        assert.strictEqual(r.callReturn[0], 1);
                                        assert.strictEqual(r.callReturn.length, 3);
                                    },
                                    onTradeSuccess: function (r) {
                                        console.log("trade success:", r)
                                        assert.isArray(r.callReturn);
                                        assert.strictEqual(r.callReturn[0], 1);
                                        assert.strictEqual(r.callReturn.length, 3);
                                        nextTrade(r);
                                    },
                                    onTradeFailed: nextTrade
                                });
                            });
                        }, function (x) {
                            if (x && x.callReturn) return done();
                            done(x);
                        });
                    });
                },
                onFailed: done
            });
        },
        onFailed: done
    });
}

function createMarket(done, augur) {
    var suffix = Math.random().toString(36).substring(4);
    var description = madlibs.adjective() + "-" + madlibs.noun() + "-" + suffix;
    augur.createSingleEventMarket({
        branchId: t.branch,
        description: t.description,
        expDate: new Date().getTime() / 1000,
        minValue: 1,
        maxValue: 2,
        numOutcomes: 2,
        tradingFee: "0.03",
        makerFees: "0.5",
        tags: t.tags,
        extraInfo: t.extraInfo,
        resolution: "augur.js test suite",
        onSent: function (r) {

        },
        onSuccess: function (r) {
            newMarketId = res.marketIDs;
        },
        onFailed: done
    });
}

if (process.env.AUGURJS_INTEGRATION_TESTS) {
    describe("Integration tests", function () {
        describe("Price history", function () {
            before("Trade in market " + marketId, function (done) {
                this.timeout(tools.TIMEOUT*4);
                trade(done, augur);
            });

            it("[async] getMarketPriceHistory(" + marketId + ")", function (done) {
                this.timeout(tools.TIMEOUT);
                var start = (new Date()).getTime();
                augur.getMarketPriceHistory(marketId, function (priceHistory) {
                    console.log("[async] getMarketPriceHistory:", ((new Date()).getTime() - start) / 1000, "seconds");
                    console.log("priceHistory:", priceHistory);
                    assert.isObject(priceHistory);
                    for (var k in priceHistory) {
                        if (!priceHistory.hasOwnProperty(k)) continue;
                        var logs = priceHistory[k];
                        assert.isArray(logs);
                        if (k === outcome && process.env.AUGURJS_INTEGRATION_TESTS) {
                            assert.property(logs, "length");
                            assert.isAbove(logs.length, 0);
                            assert.property(logs[0], "price");
                            assert.property(logs[0], "blockNumber");
                            assert.property(logs[0], "market");
                            assert.property(logs[0], "user");
                            assert.isAbove(logs[0].market.length, 64);
                            assert.strictEqual(logs[0].user.length, 42);
                        }
                    }
                    done();
                });
            });

            it("[sync] getMarketPriceHistory(" + marketId + ")", function () {
                this.timeout(tools.TIMEOUT);
                var start = (new Date()).getTime();
                var priceHistory = augur.getMarketPriceHistory(marketId);
                console.log("[sync] getMarketPriceHistory:", ((new Date()).getTime() - start) / 1000, "seconds");
                assert.isObject(priceHistory);
                for (var k in priceHistory) {
                    if (!priceHistory.hasOwnProperty(k)) continue;
                    var logs = priceHistory[k];
                    assert.isArray(logs);
                    if (k === outcome && process.env.AUGURJS_INTEGRATION_TESTS) {
                        assert.property(logs, "length");
                        assert.isAbove(logs.length, 0);
                        assert.property(logs[0], "price");
                        assert.property(logs[0], "blockNumber");
                        assert.property(logs[0], "market");
                        assert.property(logs[0], "user");
                        assert.isAbove(logs[0].market.length, 64);
                        assert.strictEqual(logs[0].user.length, 42);
                    }
                }
            });
        });

        describe("Account trade list", function () {
            var account = augur.coinbase;
            it("getAccountTrades(" + account + ")", function (done) {
                this.timeout(tools.TIMEOUT);
                augur.getAccountTrades(account, function (trades) {
                    for (var marketId in trades) {
                        if (!trades.hasOwnProperty(marketId)) continue;
                        for (var outcomeId in trades[marketId]) {
                            if (!trades[marketId].hasOwnProperty(outcomeId)) continue;
                            assert.isArray(trades[marketId][outcomeId]);
                            for (var i = 0; i < trades[marketId][outcomeId].length; ++i) {
                                assert.property(trades[marketId][outcomeId][i], "price");
                                assert.property(trades[marketId][outcomeId][i], "cost");
                                assert.property(trades[marketId][outcomeId][i], "blockNumber");
                                assert.property(trades[marketId][outcomeId][i], "market");
                                assert.property(trades[marketId][outcomeId][i], "shares");
                                assert.isAbove(trades[marketId][outcomeId][i].market.length, 64);
                                assert.isAbove(trades[marketId][outcomeId][i].blockNumber, 0);
                            }
                        }
                    }
                    done();
                });
            });

            it("meanTradePrice", function () {
                this.timeout(tools.TIMEOUT);
                var trades = {
                  "0x29701b0b0e6f5ca52a67a4768fc00dbb8be71adbc8cb46227730d38b716a47c4": {
                    "1": [
                      {
                        "market": "-0xd68fe4f4f190a35ad5985b89703ff2447418e5243734b9dd88cf2c748e95b83c",
                        "price": "0.82045824954424709328",
                        "cost": "-0.82018228611039516938",
                        "shares": "1.00033646597655826437",
                        "blockNumber": 644977
                      },
                      {
                        "market": "-0xd68fe4f4f190a35ad5985b89703ff2447418e5243734b9dd88cf2c748e95b83c",
                        "price": "0.81993897859964738704",
                        "cost": "0.80787955181873924188",
                        "shares": "-1.01492725834409269876",
                        "blockNumber": 644979
                      },
                      {
                        "market": "-0xd68fe4f4f190a35ad5985b89703ff2447418e5243734b9dd88cf2c748e95b83c",
                        "price": "0.82518241364421609455",
                        "cost": "-0.82253521838476664703",
                        "shares": "1.00321833667456551254",
                        "blockNumber": 644983
                      },
                      {
                        "market": "-0xd68fe4f4f190a35ad5985b89703ff2447418e5243734b9dd88cf2c748e95b83c",
                        "price": "0.83052169849481654283",
                        "cost": "-0.82782847246891575583",
                        "shares": "1.00325336239990454703",
                        "blockNumber": 644986
                      },
                      {
                        "market": "-0xd68fe4f4f190a35ad5985b89703ff2447418e5243734b9dd88cf2c748e95b83c",
                        "price": "0.82784170897281763885",
                        "cost": "0.81672591182321328205",
                        "shares": "-1.01361019283052997848",
                        "blockNumber": 644989
                      },
                      {
                        "market": "-0xd68fe4f4f190a35ad5985b89703ff2447418e5243734b9dd88cf2c748e95b83c",
                        "price": "0.83321923360457458493",
                        "cost": "-0.83050781765012742723",
                        "shares": "1.00326476873164053795",
                        "blockNumber": 644991
                      },
                      {
                        "market": "-0xd68fe4f4f190a35ad5985b89703ff2447418e5243734b9dd88cf2c748e95b83c",
                        "price": "0.83865486635747354266",
                        "cost": "-0.83591620902138590282",
                        "shares": "1.00327623427627250928",
                        "blockNumber": 644993
                      },
                      {
                        "market": "-0xd68fe4f4f190a35ad5985b89703ff2447418e5243734b9dd88cf2c748e95b83c",
                        "price": "0.84412555914513416264",
                        "cost": "-0.84137110799196994636",
                        "shares": "1.00327376484288607731",
                        "blockNumber": 644997
                      },
                      {
                        "market": "-0xd68fe4f4f190a35ad5985b89703ff2447418e5243734b9dd88cf2c748e95b83c",
                        "price": "0.84961008802936918184",
                        "cost": "-0.84685036646142143536",
                        "shares": "1.00325880660532661712",
                        "blockNumber": 644999
                      },
                      {
                        "market": "-0xd68fe4f4f190a35ad5985b89703ff2447418e5243734b9dd88cf2c748e95b83c",
                        "price": "0.8550891039941987265",
                        "cost": "-0.85233368990593397419",
                        "shares": "1.00323278795722464969",
                        "blockNumber": 645008
                      }
                    ],
                    "2": [
                      {
                        "market": "-0xd68fe4f4f190a35ad5985b89703ff2447418e5243734b9dd88cf2c748e95b83c",
                        "price": "0.82104052498215984637",
                        "cost": "-0.82049768071214715934",
                        "shares": "1.00066160366174530544",
                        "blockNumber": 644731
                      }
                    ]
                  },
                  "0x5301a04389ab011f4778c1d24b9b0a3e765e056191f15a0a05bb4095f77cd086": {
                    "2": [
                      {
                        "market": "-0xacfe5fbc7654fee0b8873e2db464f5c189a1fa9e6e0ea5f5fa44bf6a08832f7a",
                        "price": "0.99828751399118974795",
                        "cost": "-0.89279315494178463524",
                        "shares": "1.11816215039897339423",
                        "blockNumber": 644960
                      },
                      {
                        "market": "-0xacfe5fbc7654fee0b8873e2db464f5c189a1fa9e6e0ea5f5fa44bf6a08832f7a",
                        "price": "0.5553283405211204048",
                        "cost": "0.8749372918429489426",
                        "shares": "-0.63470644776311777503",
                        "blockNumber": 644962
                      }
                    ]
                  },
                  "0xbfe7647c995a8717f80ec7ef7721ef44b99fafa00c826305b4172d5b14c638b6": {
                    "3": [
                      {
                        "market": "-0x40189b8366a578e807f1381088de10bb4660505ff37d9cfa4be8d2a4eb39c74a",
                        "price": "0.90344548683303604712",
                        "cost": "-0.65811856274959694955",
                        "shares": "1.37277010248498623241",
                        "blockNumber": 644964
                      },
                      {
                        "market": "-0x40189b8366a578e807f1381088de10bb4660505ff37d9cfa4be8d2a4eb39c74a",
                        "price": "0.36231443954838966209",
                        "cost": "0.64495619149460501062",
                        "shares": "-0.56176596848969141732",
                        "blockNumber": 644966
                      }
                    ]
                  },
                  "0x287af51fd19e97db3055d20419ed6cfc8ad1ce580242aa6093bb9913ea6b083a": {
                    "2": [
                      {
                        "market": "-0xd7850ae02e616824cfaa2dfbe6129303752e31a7fdbd559f6c4466ec1594f7c6",
                        "price": "1.00000000000000587377",
                        "cost": "-1.0000000000000005839",
                        "shares": "1.00000000000000528987",
                        "blockNumber": 667651
                      },
                      {
                        "market": "-0xd7850ae02e616824cfaa2dfbe6129303752e31a7fdbd559f6c4466ec1594f7c6",
                        "price": "0.99999999999999613851",
                        "cost": "0.98000000000000057226",
                        "shares": "-1.0204081632653015863",
                        "blockNumber": 667653
                      }
                    ],
                    "3": [
                      {
                        "market": "-0xd7850ae02e616824cfaa2dfbe6129303752e31a7fdbd559f6c4466ec1594f7c6",
                        "price": "0.70463773817496133754",
                        "cost": "-0.47344867097711899558",
                        "shares": "1.48830862006795100636",
                        "blockNumber": 644968
                      },
                      {
                        "market": "-0xd7850ae02e616824cfaa2dfbe6129303752e31a7fdbd559f6c4466ec1594f7c6",
                        "price": "0.27231145890661296715",
                        "cost": "0.46397969755757661569",
                        "shares": "-0.5869038243269707533",
                        "blockNumber": 644970
                      }
                    ]
                  },
                  "0x4ad2142863a455113af108057a1608480359221345c77ef4f8f55b44710f96ae": {
                    "2": [
                      {
                        "market": "-0xb52debd79c5baaeec50ef7fa85e9f7b7fca6ddecba38810b070aa4bb8ef06952",
                        "price": "0.18117645173059083834",
                        "cost": "-0.15259525676046589894",
                        "shares": "1.18730067747118666215",
                        "blockNumber": 667655
                      },
                      {
                        "market": "-0xb52debd79c5baaeec50ef7fa85e9f7b7fca6ddecba38810b070aa4bb8ef06952",
                        "price": "0.12983029337645998584",
                        "cost": "0.15106930419286123996",
                        "shares": "-0.85940882610217979164",
                        "blockNumber": 667658
                      }
                    ],
                    "4": [
                      {
                        "market": "-0xb52debd79c5baaeec50ef7fa85e9f7b7fca6ddecba38810b070aa4bb8ef06952",
                        "price": "0.18117645173059083834",
                        "cost": "-0.15259525676046589894",
                        "shares": "1.18730067747118666215",
                        "blockNumber": 644973
                      },
                      {
                        "market": "-0xb52debd79c5baaeec50ef7fa85e9f7b7fca6ddecba38810b070aa4bb8ef06952",
                        "price": "0.12983029337645998584",
                        "cost": "0.15106930419286123996",
                        "shares": "-0.85940882610217979164",
                        "blockNumber": 644975
                      }
                    ]
                  },
                  "0xf802fa843af371d221445c30a2054abc6eea5a0d2acb9036b63b44b49b414b83": {
                    "2": [
                      {
                        "market": "-0x7fd057bc50c8e2ddebba3cf5dfab5439115a5f2d5346fc949c4bb4b64beb47d",
                        "price": "0.57248695603157573591",
                        "cost": "-0.5386076691413957334",
                        "shares": "1.06290160506661108074",
                        "blockNumber": 659046
                      }
                    ]
                  },
                  "0x2b131e449fb911834913ca4299f2bb62acb188014e5ae3c6ea3acba001c80875": {
                    "2": [
                      {
                        "market": "-0xd4ece1bb6046ee7cb6ec35bd660d449d534e77feb1a51c3915c5345ffe37f78b",
                        "price": "0.34262501842840975465",
                        "cost": "-0.33230690526591044078",
                        "shares": "1.03104995111143660311",
                        "blockNumber": 667646
                      },
                      {
                        "market": "-0xd4ece1bb6046ee7cb6ec35bd660d449d534e77feb1a51c3915c5345ffe37f78b",
                        "price": "0.32329006699866180002",
                        "cost": "0.32566076716059223198",
                        "shares": "-0.99272033845955606048",
                        "blockNumber": 667648
                      }
                    ]
                  },
                  "0xe0e2437401aad23f5749a824da1687e01f3684a865af029486b477374717d07e": {
                    "1": [
                      {
                        "market": "-0x1f1dbc8bfe552dc0a8b657db25e9781fe0c97b579a50fd6b794b88c8b8e82f82",
                        "price": "5.98466764900056586492",
                        "cost": "-5.98113738181345967352",
                        "shares": "1.00059023342246584995",
                        "blockNumber": 769430
                      },
                      {
                        "market": "-0x1f1dbc8bfe552dc0a8b657db25e9781fe0c97b579a50fd6b794b88c8b8e82f82",
                        "price": "5.9873591204774185958",
                        "cost": "-5.98569572583790050221",
                        "shares": "1.00027789495418851169",
                        "blockNumber": 769531
                      },
                      {
                        "market": "-0x1f1dbc8bfe552dc0a8b657db25e9781fe0c97b579a50fd6b794b88c8b8e82f82",
                        "price": "5.98902834507923924161",
                        "cost": "-5.98829089682658929444",
                        "shares": "1.000123148368266603",
                        "blockNumber": 769609
                      },
                      {
                        "market": "-0x1f1dbc8bfe552dc0a8b657db25e9781fe0c97b579a50fd6b794b88c8b8e82f82",
                        "price": "5.98988779997774854237",
                        "cost": "-5.98949787791481511864",
                        "shares": "1.00006510096019420768",
                        "blockNumber": 769620
                      },
                      {
                        "market": "-0x1f1dbc8bfe552dc0a8b657db25e9781fe0c97b579a50fd6b794b88c8b8e82f82",
                        "price": "5.99038766400426114182",
                        "cost": "-5.99015688222951430862",
                        "shares": "1.0000385268331504762",
                        "blockNumber": 769717
                      },
                      {
                        "market": "-0x1f1dbc8bfe552dc0a8b657db25e9781fe0c97b579a50fd6b794b88c8b8e82f82",
                        "price": "5.99065978895162333084",
                        "cost": "-5.99053094417107930041",
                        "shares": "1.00002150807361564492",
                        "blockNumber": 769726
                      },
                      {
                        "market": "-0x1f1dbc8bfe552dc0a8b657db25e9781fe0c97b579a50fd6b794b88c8b8e82f82",
                        "price": "5.99085393522999034785",
                        "cost": "-5.99076140132562570743",
                        "shares": "1.00001544610078180791",
                        "blockNumber": 769732
                      }
                    ],
                    "2": [
                      {
                        "market": "-0x1f1dbc8bfe552dc0a8b657db25e9781fe0c97b579a50fd6b794b88c8b8e82f82",
                        "price": "5.96578704547290622831",
                        "cost": "-5.96466755097810700283",
                        "shares": "1.0001876876599125205",
                        "blockNumber": 769490
                      },
                      {
                        "market": "-0x1f1dbc8bfe552dc0a8b657db25e9781fe0c97b579a50fd6b794b88c8b8e82f82",
                        "price": "5.96595355779457257178",
                        "cost": "-5.96581886968208709605",
                        "shares": "1.00002257663456226473",
                        "blockNumber": 769528
                      }
                    ]
                  }
                };
                var meanBuyPrice, meanSellPrice;
                for (var marketId in trades) {
                    if (!trades.hasOwnProperty(marketId)) continue;
                    meanBuyPrice = augur.meanTradePrice(trades[marketId]);
                    meanSellPrice = augur.meanTradePrice(trades[marketId], true);
                    for (var outcomeId in meanBuyPrice) {
                        if (!meanBuyPrice.hasOwnProperty(outcomeId)) continue;
                        assert.isAbove(abi.number(meanBuyPrice[outcomeId]), 0);
                    }
                    for (var outcomeId in meanSellPrice) {
                        if (!meanSellPrice.hasOwnProperty(outcomeId)) continue;
                        assert.isAbove(abi.number(meanSellPrice[outcomeId]), 0);
                    }
                }
            });

            it("getAccountMeanTradePrices(" + account + ")", function (done) {
                this.timeout(tools.TIMEOUT);
                augur.getAccountMeanTradePrices(account, function (meanPrices) {
                    for (var bs in meanPrices) {
                        if (!meanPrices.hasOwnProperty(bs)) continue;
                        for (var marketId in meanPrices[bs]) {
                            if (!meanPrices[bs].hasOwnProperty(marketId)) continue;
                            for (var outcomeId in meanPrices[bs][marketId]) {
                                if (!meanPrices[bs][marketId].hasOwnProperty(outcomeId)) continue;
                                assert.isAbove(abi.number(meanPrices[bs][marketId][outcomeId]), 0);
                            }
                        }
                    }
                    done();
                });
            });
        });

        // describe("Price listener", function () {
        //     var listeners = [];
        //     it("should find message after buyShares", function (done) {
        //         this.timeout(tools.TIMEOUT*4);
        //         var augur = tools.setup(require(augurpath), process.argv.slice(2));

        //         augur.filters.start_price_listener("updatePrice(int256,int256,int256,int256,int256,int256)", function (filter_id) {

        //             // poll contracts filter
        //             listeners.push(setInterval(function () {
        //                 augur.filters.poll_price_listener(function (data) {
        //                     if (data) {
        //                         if (data.error) {
        //                             done(data);
        //                         } else {
        //                             clearInterval(listeners[listeners.length - 1]);
        //                             augur.filters.clear_price_filter(function () {
        //                                 assert.isObject(data);
        //                                 assert.property(data, "user");
        //                                 assert.property(data, "marketId");
        //                                 assert.property(data, "outcome");
        //                                 assert.property(data, "price");
        //                                 assert.property(data, "cost");
        //                                 assert.property(data, "blockNumber");
        //                                 assert(abi.bignum(data.user).eq(abi.bignum(augur.coinbase)));
        //                                 var market = abi.bignum(data.marketId);
        //                                 var marketplus = market.plus(abi.constants.MOD);
        //                                 if (marketplus.lt(abi.constants.BYTES_32)) {
        //                                     market = marketplus;
        //                                 }
        //                                 assert(market.eq(abi.bignum(data.marketId)));
        //                                 assert(abi.bignum(data.outcome).eq(abi.bignum(outcome)));
        //                                 assert.isAbove(parseInt(data.blockNumber), 0);
        //                                 done();
        //                             });
        //                         }
        //                     }
        //                 });
        //             }, augur.filters.PULSE));

        //             setTimeout(function () { trade(done, augur); }, DELAY);
        //         });
        //     });

        //     it("should find message after sellShares", function (done) {
        //         this.timeout(tools.TIMEOUT*4);
        //         var augur = tools.setup(require(augurpath), process.argv.slice(2));
        //         augur.filters.start_price_listener("updatePrice", function (filter_id) {

        //             listeners.push(setInterval(function () {
        //                 augur.filters.poll_price_listener(function (data) {
        //                     if (data) {
        //                         if (data.error) {
        //                             done(data);
        //                         } else {
        //                             clearInterval(listeners[listeners.length - 1]);
        //                             augur.filters.clear_price_filter(function () {
        //                                 assert.isObject(data);
        //                                 assert.property(data, "user");
        //                                 assert.property(data, "marketId");
        //                                 assert.property(data, "outcome");
        //                                 assert.property(data, "price");
        //                                 assert.property(data, "cost");
        //                                 assert.property(data, "blockNumber");
        //                                 assert(abi.bignum(data.user).eq(abi.bignum(augur.coinbase)));
        //                                 var market = abi.bignum(data.marketId);
        //                                 var marketplus = market.plus(abi.constants.MOD);
        //                                 if (marketplus.lt(abi.constants.BYTES_32)) {
        //                                     market = marketplus;
        //                                 }
        //                                 assert(market.eq(abi.bignum(data.marketId)));
        //                                 assert(abi.bignum(data.outcome).eq(abi.bignum(outcome)));
        //                                 assert.isAbove(parseInt(data.blockNumber), 0);
        //                                 done();
        //                             });
        //                         }
        //                     }
        //                 });
        //             }, augur.filters.PULSE));

        //             setTimeout(function () { sellShares(done, augur); }, DELAY);
        //         });
        //     });

        // });

        // describe("Contracts listener", function () {

        //     it("should find message after trade", function (done) {
        //         this.timeout(tools.TIMEOUT*4);
        //         var augur = tools.setup(require(augurpath), process.argv.slice(2));
        //         augur.filters.start_contracts_listener(function (contracts_filter) {
        //             assert.deepEqual(augur.filters.filter.contracts, contracts_filter);

        //             // poll contracts filter
        //             var listener = setInterval(function () {
        //                 augur.filters.poll_contracts_listener(function (message) {
        //                     clearInterval(listener);

        //                     assert.property(message, "address");
        //                     assert.property(message, "topics");
        //                     assert.property(message, "data");
        //                     assert.property(message, "blockNumber");
        //                     assert.property(message, "logIndex");
        //                     assert.property(message, "blockHash");
        //                     assert.property(message, "transactionHash");
        //                     assert.property(message, "transactionIndex");
        //                     assert.strictEqual(
        //                         message.address,
        //                         augur.contracts.buyAndSellShares
        //                     );
        //                     assert.isArray(message.topics);
        //                     assert.strictEqual(message.topics.length, 4);
        //                     assert.isArray(message.data);
        //                     assert.strictEqual(message.data.length, 2);
        //                     assert.isAbove(parseInt(message.blockNumber), 0);

        //                     // tear down filter
        //                     augur.filters.clear_contracts_filter();
        //                     assert.isNull(augur.filters.filter.contracts.id);
        //                     assert.isNull(augur.filters.filter.contracts.heartbeat);
        //                     done();
        //                 });
        //             }, augur.filters.PULSE);

        //             setTimeout(function () { trade(done, augur); }, DELAY);
        //         });
        //     });

        // });

        // describe("listen/ignore", function () {

        //     it("block filter", function (done) {
        //         this.timeout(tools.TIMEOUT);
        //         var augur = tools.setup(require(augurpath), process.argv.slice(2));
        //         augur.filters.listen({
        //             block: function (blockHash) {
        //                 // example:
        //                 // 0x999553c632fa10f3eb2af9a2be9ab612726372721680e3f76441f75f7c879a2f
        //                 assert.strictEqual(blockHash.slice(0, 2), "0x");
        //                 assert.strictEqual(blockHash.length, 66);
        //                 assert.isNull(augur.filters.filter.contracts.heartbeat);
        //                 assert.isNull(augur.filters.filter.updatePrice.heartbeat);
        //                 assert.isNotNull(augur.filters.filter.block.heartbeat);
        //                 assert.isNull(augur.filters.filter.contracts.id);
        //                 assert.isNull(augur.filters.filter.updatePrice.id);
        //                 assert.isNotNull(augur.filters.filter.block.id);

        //                 // stop heartbeat and tear down filters
        //                 augur.filters.ignore(true, {
        //                     block: function () {
        //                         assert.isNull(augur.filters.filter.contracts.heartbeat);
        //                         assert.isNull(augur.filters.filter.updatePrice.heartbeat);
        //                         assert.isNull(augur.filters.filter.block.heartbeat);
        //                         assert.isNull(augur.filters.filter.contracts.id);
        //                         assert.isNull(augur.filters.filter.updatePrice.id);
        //                         assert.isNull(augur.filters.filter.block.id);
        //                         done();
        //                     }
        //                 });
        //             }
        //         });
        //         setTimeout(function () { trade(done, augur); }, DELAY);
        //     });

        //     it("contracts filter", function (done) {
        //         this.timeout(tools.TIMEOUT);
        //         var augur = tools.setup(require(augurpath), process.argv.slice(2));
        //         augur.filters.listen({
        //             contracts: function (tx) {
        //                 // { address: '0xc1c4e2f32e4b84a60b8b7983b6356af4269aab79',
        //                 //   topics: 
        //                 //    [ '0x1a653a04916ffd3d6f74d5966492bda358e560be296ecf5307c2e2c2fdedd35a',
        //                 //      '0x00000000000000000000000005ae1d0ca6206c6168b42efcd1fbe0ed144e821b',
        //                 //      '0x3557ce85d2ac4bcd36be7f3a6e0f63cfa6b18d34908b810ed41e44aafb399b44',
        //                 //      '0x0000000000000000000000000000000000000000000000000000000000000001' ],
        //                 //   data: 
        //                 //    [ '0x000000000000000000000000000000000000000000000001000000000000d330',
        //                 //      '0xfffffffffffffffffffffffffffffffffffffffffffffffeffffffffffffffa3' ],
        //                 //   blockNumber: '0x110d',
        //                 //   logIndex: '0x0',
        //                 //   blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        //                 //   transactionHash: '0x8481c76a1f88a203191c1cd1942963ff9f1ea31b1db02f752771fef30133798e',
        //                 //   transactionIndex: '0x0' }
        //                 assert.property(tx, "address");
        //                 assert.property(tx, "topics");
        //                 assert.property(tx, "data");
        //                 assert.property(tx, "blockNumber");
        //                 assert.property(tx, "logIndex");
        //                 assert.property(tx, "blockHash");
        //                 assert.property(tx, "transactionHash");
        //                 assert.property(tx, "transactionIndex");
        //                 assert.strictEqual(
        //                     tx.address,
        //                     augur.contracts.buyAndSellShares
        //                 );
        //                 assert.isArray(tx.topics);
        //                 assert.strictEqual(tx.topics.length, 4);
        //                 assert.isArray(tx.data);
        //                 assert.strictEqual(tx.data.length, 2);
        //                 assert.isAbove(parseInt(tx.blockNumber), 0);
        //                 assert.isAbove(parseInt(augur.filters.filter.contracts.id), 0);

        //                 // stop heartbeat
        //                 augur.filters.ignore({
        //                     contracts: function () {
        //                         assert.isNull(augur.filters.filter.contracts.heartbeat);
        //                         assert.isNull(augur.filters.filter.updatePrice.heartbeat);
        //                         assert.isNull(augur.filters.filter.block.heartbeat);
        //                         assert.isNotNull(augur.filters.filter.contracts.id);
        //                         assert.isNull(augur.filters.filter.updatePrice.id);
        //                         assert.isNull(augur.filters.filter.block.id);

        //                         // tear down filters
        //                         augur.filters.ignore(true, {
        //                             contracts: function () {
        //                                 assert.isNull(augur.filters.filter.contracts.heartbeat);
        //                                 assert.isNull(augur.filters.filter.updatePrice.heartbeat);
        //                                 assert.isNull(augur.filters.filter.block.heartbeat);
        //                                 assert.isNull(augur.filters.filter.contracts.id);
        //                                 assert.isNull(augur.filters.filter.updatePrice.id);
        //                                 assert.isNull(augur.filters.filter.block.id);
        //                                 done();
        //                             }
        //                         });
        //                     }
        //                 });
        //             }
        //         });
        //         setTimeout(function () { trade(done, augur); }, DELAY);
        //     });

        //     it("price filter", function (done) {
        //         this.timeout(tools.TIMEOUT);
        //         var augur = tools.setup(require(augurpath), process.argv.slice(2));
        //         augur.filters.listen({
        //             price: function (update) {
        //                 // { user: '0x00000000000000000000000005ae1d0ca6206c6168b42efcd1fbe0ed144e821b',
        //                 //   marketId: '-0xcaa8317a2d53b432c94180c591f09c30594e72cb6f747ef12be1bb5504c664bc',
        //                 //   outcome: '1',
        //                 //   price: '1.00000000000000002255',
        //                 //   cost: '-1.00000000000000008137',
        //                 //   blockNumber: '4722' }
        //                 assert.property(update, "user");
        //                 assert.property(update, "marketId");
        //                 assert.property(update, "outcome");
        //                 assert.property(update, "price");
        //                 assert.property(update, "cost");
        //                 assert.property(update, "blockNumber");
        //                 assert.isAbove(parseInt(update.blockNumber), 0);
        //                 assert.strictEqual(update.outcome, outcome);
        //                 assert(abi.bignum(update.user).eq(abi.bignum(augur.coinbase)));
        //                 assert.isAbove(parseInt(augur.filters.filter.updatePrice.id), 0);
        //                 assert.isNull(augur.filters.filter.contracts.heartbeat);
        //                 assert.isNotNull(augur.filters.filter.updatePrice.heartbeat);
        //                 assert.isNull(augur.filters.filter.block.heartbeat);
        //                 assert.isNull(augur.filters.filter.contracts.id);
        //                 assert.isNotNull(augur.filters.filter.updatePrice.id);
        //                 assert.isNull(augur.filters.filter.block.id);

        //                 // stop heartbeat and tear down filters
        //                 augur.filters.ignore(true, {
        //                     price: function () {
        //                         assert.isNull(augur.filters.filter.contracts.heartbeat);
        //                         assert.isNull(augur.filters.filter.updatePrice.heartbeat);
        //                         assert.isNull(augur.filters.filter.block.heartbeat);
        //                         assert.isNull(augur.filters.filter.contracts.id);
        //                         assert.isNull(augur.filters.filter.updatePrice.id);
        //                         assert.isNull(augur.filters.filter.block.id);
        //                         done();
        //                     }
        //                 });
        //             }
        //         });
        //         setTimeout(function () { trade(done, augur); }, DELAY);
        //     });

        //     it("combined", function (done) {
        //         this.timeout(tools.TIMEOUT*6);
        //         var augur = tools.setup(tools.reset(augurpath), process.argv.slice(2));
        //         var setup = {
        //             block: null,
        //             contracts: null,
        //             price: null
        //         };
        //         var called_teardown = {
        //             block: false,
        //             contracts: false,
        //             price: false
        //         };

        //         // stop heartbeat and tear down filters
        //         function teardown(setup, done) {
        //             if (setup.price && setup.contracts && setup.block) {
        //                 var mutex = locks.createMutex();
        //                 mutex.lock(function () {
        //                     augur.filters.ignore(true, {
        //                         block: function () {
        //                             assert.isNull(augur.filters.filter.block.heartbeat);
        //                             assert.isNull(augur.filters.filter.block.id);
        //                         },
        //                         contracts: function () {
        //                             assert.isNull(augur.filters.filter.contracts.heartbeat);
        //                             assert.isNull(augur.filters.filter.contracts.id);
        //                         },
        //                         price: function () {
        //                             assert.isNull(augur.filters.filter.updatePrice.heartbeat);
        //                             assert.isNull(augur.filters.filter.updatePrice.id);
        //                         }
        //                     }, function (err) {
        //                         mutex.unlock();
        //                         if (err) return done(err);
        //                         done();
        //                     });
        //                 });
        //             }
        //         }
        //         augur.filters.listen({
        //             block: function (blockHash) {
        //                 assert.strictEqual(blockHash.slice(0, 2), "0x");
        //                 assert.strictEqual(blockHash.length, 66);
        //                 assert.isNotNull(augur.filters.filter.block.heartbeat);
        //                 assert.isNotNull(augur.filters.filter.block.id);
        //                 if (!setup.block) {
        //                     setup.block = true;
        //                     teardown(setup, done);
        //                 }
        //             },
        //             contracts: function (tx) {
        //                 assert.property(tx, "address");
        //                 assert.property(tx, "topics");
        //                 assert.property(tx, "data");
        //                 assert.property(tx, "blockNumber");
        //                 assert.property(tx, "logIndex");
        //                 assert.property(tx, "blockHash");
        //                 assert.property(tx, "transactionHash");
        //                 assert.property(tx, "transactionIndex");
        //                 assert.isAbove(parseInt(tx.blockNumber), 0);
        //                 assert.isAbove(parseInt(augur.filters.filter.contracts.id), 0);
        //                 if (!setup.contracts) {
        //                     setup.contracts = true;
        //                     teardown(setup, done);
        //                 }
        //             },
        //             price: function (update) {
        //                 assert.property(update, "user");
        //                 assert.property(update, "marketId");
        //                 assert.property(update, "outcome");
        //                 assert.property(update, "price");
        //                 assert.property(update, "cost");
        //                 assert.property(update, "blockNumber");
        //                 assert.isAbove(parseInt(update.blockNumber), 0);
        //                 assert.strictEqual(update.outcome, outcome);
        //                 assert(abi.bignum(update.user).eq(abi.bignum(augur.coinbase)));
        //                 assert.isAbove(parseInt(augur.filters.filter.updatePrice.id), 0);
        //                 assert.isNotNull(augur.filters.filter.updatePrice.heartbeat);
        //                 assert.isNotNull(augur.filters.filter.updatePrice.id);
        //                 if (!setup.price) {
        //                     setup.price = true;
        //                     teardown(setup, done);
        //                 }
        //             }
        //         });
        //         setTimeout(function () { trade(done, augur); }, DELAY);
        //         setTimeout(function () { createMarket(done, augur); }, DELAY);
        //     });
        // });
    });
}
